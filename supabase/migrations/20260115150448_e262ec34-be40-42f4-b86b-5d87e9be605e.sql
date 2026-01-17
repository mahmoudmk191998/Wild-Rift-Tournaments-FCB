-- Create team join requests table
CREATE TABLE public.team_join_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  riot_id TEXT,
  message TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enable RLS
ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own requests"
ON public.team_join_requests FOR SELECT
USING (user_id = auth.uid() OR 
       EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND captain_id = auth.uid()) OR
       is_admin());

-- Users can create join requests
CREATE POLICY "Users can create join requests"
ON public.team_join_requests FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Team captains and admins can update requests
CREATE POLICY "Captains can update requests"
ON public.team_join_requests FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND captain_id = auth.uid()) OR is_admin());

-- Users can delete their own pending requests
CREATE POLICY "Users can delete their pending requests"
ON public.team_join_requests FOR DELETE
USING ((user_id = auth.uid() AND status = 'pending') OR 
       EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND captain_id = auth.uid()) OR
       is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_team_join_requests_updated_at
BEFORE UPDATE ON public.team_join_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();