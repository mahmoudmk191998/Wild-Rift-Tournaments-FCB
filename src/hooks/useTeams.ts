import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface Team {
  id: string;
  tournament_id: string;
  name: string;
  logo_url: string | null;
  captain_id: string | null;
  status: "incomplete" | "pending_payment" | "registered" | "qualified" | "eliminated";
  group_name: string | null;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  riot_id: string | null;
  role: string;
  joined_at: string;
  profiles?: {
    username: string;
    riot_id: string | null;
    rank: string | null;
    avatar_url?: string | null;
  };
}

export function useTeams(tournamentId?: string) {
  return useQuery({
    queryKey: ["teams", tournamentId],
    queryFn: async () => {
      let query = supabase
        .from("teams")
        .select(`
          *,
          team_members (user_id),
          tournaments:tournament_id (name, team_size)
        `)
        .order("created_at", { ascending: false });

      if (tournamentId) {
        query = query.eq("tournament_id", tournamentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (Team & { team_members?: { user_id: string }[]; tournaments?: { name: string; team_size: number } })[];
    },
  });
}

export function useTeam(id: string | undefined) {
  return useQuery({
    queryKey: ["team", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Team | null;
    },
    enabled: !!id,
  });
}

export function useTeamMembers(teamId: string | undefined) {
  return useQuery({
    queryKey: ["team-members", teamId],
    queryFn: async () => {
      if (!teamId) return [];

      const { data: members, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", teamId);

      if (error) throw error;
      if (!members) return [];

      // Get profiles for members
      const userIds = members.map(m => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, riot_id, rank, avatar_url")
        .in("user_id", userIds);

      return members.map(member => ({
        ...member,
        profiles: profiles?.find(p => p.user_id === member.user_id) || null,
      })) as TeamMember[];
    },
    enabled: !!teamId,
  });
}

export function useMyTeams() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-teams", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("team_members")
        .select(`
          team:team_id (
            *
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map((item: any) => item.team) as Team[];
    },
    enabled: !!user,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      name,
      tournamentId,
      description,
    }: {
      name: string;
      tournamentId: string;
      description?: string;
    }) => {
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");

      // Create team
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({
          name,
          tournament_id: tournamentId,
          captain_id: user.id,
          status: "incomplete",
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add captain as team member
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: user.id,
          riot_id: profile?.riot_id,
          role: "captain",
        });

      if (memberError) throw memberError;

      return team;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      toast.success("تم إنشاء الفريق بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء الفريق");
    },
  });
}

export function useJoinTeam() {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async (teamId: string) => {
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");

      const { data, error } = await supabase
        .from("team_members")
        .insert({
          team_id: teamId,
          user_id: user.id,
          riot_id: profile?.riot_id,
          role: "player",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      toast.success("تم الانضمام للفريق بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء الانضمام للفريق");
    },
  });
}

export function useLeaveTeam() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (teamId: string) => {
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");

      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", teamId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      toast.success("تم مغادرة الفريق بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء مغادرة الفريق");
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Team> & { id: string }) => {
      const { data, error } = await supabase
        .from("teams")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", data.id] });
      toast.success("تم تحديث الفريق بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث الفريق");
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("تم حذف الفريق بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الفريق");
    },
  });
}
