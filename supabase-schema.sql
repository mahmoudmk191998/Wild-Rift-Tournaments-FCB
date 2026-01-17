-- =====================================================
-- RIFT CHAMPIONS LEAGUE - DATABASE SCHEMA
-- =====================================================
-- This file contains the complete database schema for the
-- Wild Rift esports tournament platform.
-- Version: 1.0.0
-- Last Updated: 2026-01-15
-- =====================================================

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- User roles for access control
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Tournament status states
CREATE TYPE public.tournament_status AS ENUM (
  'upcoming',           -- Tournament announced but registration not open
  'registration_open',  -- Registration is open
  'registration_closed',-- Registration closed, tournament pending
  'in_progress',        -- Tournament is currently running
  'completed',          -- Tournament finished
  'cancelled'           -- Tournament was cancelled
);

-- Tournament format types
CREATE TYPE public.tournament_type AS ENUM (
  'group_knockout',     -- Group stage followed by knockout
  'single_elimination'  -- Direct elimination bracket
);

-- Match format types
CREATE TYPE public.match_type AS ENUM (
  'bo1',  -- Best of 1
  'bo3',  -- Best of 3
  'bo5'   -- Best of 5
);

-- Payment verification status
CREATE TYPE public.payment_status AS ENUM (
  'pending',   -- Awaiting admin review
  'approved',  -- Payment confirmed
  'rejected'   -- Payment rejected
);

-- Team registration status
CREATE TYPE public.team_status AS ENUM (
  'incomplete',      -- Team doesn't have enough members
  'pending_payment', -- Waiting for payment approval
  'registered',      -- Fully registered and paid
  'qualified',       -- Qualified for knockout stage
  'eliminated'       -- Eliminated from tournament
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- User profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT NOT NULL,
  riot_id TEXT,                    -- Player's Riot ID (e.g., "Name#TAG")
  rank TEXT,                       -- In-game rank
  avatar_url TEXT,                 -- Profile picture URL
  is_banned BOOLEAN DEFAULT false, -- Ban status
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- User roles (separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- =====================================================
-- TOURNAMENT TABLES
-- =====================================================

-- Tournaments
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  max_teams INTEGER NOT NULL DEFAULT 16,
  team_size INTEGER NOT NULL DEFAULT 5,
  entry_fee DECIMAL(10,2) NOT NULL DEFAULT 150.00,
  platform_fee_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  tournament_type tournament_type NOT NULL DEFAULT 'group_knockout',
  match_type match_type NOT NULL DEFAULT 'bo1',
  status tournament_status NOT NULL DEFAULT 'upcoming',
  num_groups INTEGER DEFAULT 4,
  teams_per_group_qualify INTEGER DEFAULT 2,
  prize_pool DECIMAL(10,2) DEFAULT 0,
  prize_distribution JSONB DEFAULT '{"first": 50, "second": 30, "third": 20}'::jsonb,
  is_locked BOOLEAN DEFAULT false,
  banner_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Teams
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  captain_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status team_status NOT NULL DEFAULT 'incomplete',
  group_name TEXT,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(tournament_id, name)
);

-- Team Members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  riot_id TEXT,
  role TEXT DEFAULT 'player',
  joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(team_id, user_id)
);

-- Team Join Requests (for players requesting to join teams)
CREATE TABLE public.team_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  riot_id TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(team_id, user_id)
);

-- =====================================================
-- PAYMENT TABLES
-- =====================================================

-- Payments (manual verification)
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  screenshot_url TEXT,           -- Payment proof image
  payment_method TEXT DEFAULT 'instapay',
  status payment_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- GROUP STAGE TABLES
-- =====================================================

-- Groups
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(tournament_id, name)
);

-- Group Standings
CREATE TABLE public.group_standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  is_qualified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(group_id, team_id)
);

-- =====================================================
-- MATCH TABLES
-- =====================================================

-- Matches
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  team1_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  team2_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  team1_score INTEGER DEFAULT 0,
  team2_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  match_type match_type NOT NULL DEFAULT 'bo1',
  stage TEXT DEFAULT 'group',    -- 'group', 'quarter', 'semi', 'final', etc.
  bracket_round INTEGER,
  bracket_position INTEGER,
  scheduled_at TIMESTAMPTZ,
  played_at TIMESTAMPTZ,
  admin_notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- CMS TABLES
-- =====================================================

-- Site Content (editable by admin)
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,      -- Unique identifier (e.g., 'homepage_hero')
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- SECURITY FUNCTIONS
-- =====================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
-- Allow admins to update any profile (needed so admin UI can ban users)
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "User roles viewable by owner and admins" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Only admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update roles" ON public.user_roles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete roles" ON public.user_roles FOR DELETE USING (public.is_admin());

-- Tournament policies
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Admins can insert tournaments" ON public.tournaments FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update tournaments" ON public.tournaments FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete tournaments" ON public.tournaments FOR DELETE USING (public.is_admin());

-- Team policies
CREATE POLICY "Teams are viewable by everyone" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Team captains and admins can update teams" ON public.teams FOR UPDATE USING (captain_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins can delete teams" ON public.teams FOR DELETE USING (public.is_admin());

-- Team members policies
CREATE POLICY "Team members are viewable by everyone" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join teams" ON public.team_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can leave teams or admins can remove" ON public.team_members FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- Team join requests policies
CREATE POLICY "Users can view their own requests" ON public.team_join_requests FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_join_requests.team_id AND captain_id = auth.uid()) OR 
  public.is_admin()
);
CREATE POLICY "Users can create join requests" ON public.team_join_requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "Captains can update requests" ON public.team_join_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_join_requests.team_id AND captain_id = auth.uid()) OR 
  public.is_admin()
);
CREATE POLICY "Users can delete their pending requests" ON public.team_join_requests FOR DELETE USING (
  (user_id = auth.uid() AND status = 'pending') OR 
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_join_requests.team_id AND captain_id = auth.uid()) OR 
  public.is_admin()
);

-- Payment policies
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can create their own payments" ON public.payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their pending payments" ON public.payments FOR UPDATE USING ((user_id = auth.uid() AND status = 'pending') OR public.is_admin());

-- Group policies
CREATE POLICY "Groups are viewable by everyone" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Admins can manage groups" ON public.groups FOR ALL USING (public.is_admin());

-- Group standings policies
CREATE POLICY "Group standings are viewable by everyone" ON public.group_standings FOR SELECT USING (true);
CREATE POLICY "Admins can manage group standings" ON public.group_standings FOR ALL USING (public.is_admin());

-- Match policies
CREATE POLICY "Matches are viewable by everyone" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Admins can manage matches" ON public.matches FOR ALL USING (public.is_admin());

-- Site content policies
CREATE POLICY "Site content is viewable by everyone" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL USING (public.is_admin());

-- Announcement policies
CREATE POLICY "Active announcements are viewable by everyone" ON public.announcements FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (public.is_admin());

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, riot_id, rank)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'riot_id',
    NEW.raw_user_meta_data->>'rank'
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_group_standings_updated_at BEFORE UPDATE ON public.group_standings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_join_requests_updated_at BEFORE UPDATE ON public.team_join_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('team-logos', 'team-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);

-- Storage policies
CREATE POLICY "Users can upload payment screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own payment screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'payment-screenshots' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));
-- Allow anyone to view payment screenshots (public bucket)
CREATE POLICY "Anyone can view payment screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'payment-screenshots');
CREATE POLICY "Anyone can view team logos" ON storage.objects FOR SELECT USING (bucket_id = 'team-logos');
CREATE POLICY "Authenticated users can upload team logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-logos' AND auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone can view banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Admins can upload banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND public.is_admin());

-- =====================================================
-- DEFAULT DATA
-- =====================================================

INSERT INTO public.site_content (key, title, content) VALUES
  ('homepage_hero', 'مرحباً بك في بطولات وايلد ريفت', 'انضم إلى أكبر منصة للبطولات التنافسية'),
  ('rules', 'قواعد البطولة', 'سيتم إضافة القواعد هنا'),
  ('faq', 'الأسئلة الشائعة', 'سيتم إضافة الأسئلة الشائعة هنا'),
  ('contact', 'تواصل معنا', 'يمكنك التواصل معنا عبر البريد الإلكتروني');

-- =====================================================
-- END OF SCHEMA
-- =====================================================
