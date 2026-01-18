import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface JoinRequest {
  id: string;
  team_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  riot_id: string | null;
  message: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    riot_id: string | null;
    rank: string | null;
    avatar_url: string | null;
  };
}

export function useTeamJoinRequests(teamId?: string) {
  return useQuery({
    queryKey: ["join-requests", teamId],
    queryFn: async () => {
      if (!teamId) return [];

      // First get the join requests
      const { data: requests, error } = await supabase
        .from("team_join_requests")
        .select("*")
        .eq("team_id", teamId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!requests) return [];

      // Then get profiles for each user
      const userIds = requests.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, riot_id, rank, avatar_url")
        .in("user_id", userIds);

      // Map profiles to requests
      const requestsWithProfiles = requests.map(request => ({
        ...request,
        status: request.status as "pending" | "approved" | "rejected",
        profiles: profiles?.find(p => p.user_id === request.user_id) || null,
      }));

      return requestsWithProfiles as JoinRequest[];
    },
    enabled: !!teamId,
  });
}

export function useMyJoinRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-join-requests", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("team_join_requests")
        .select(`
          *,
          teams:team_id (
            name,
            tournament_id
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateJoinRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      teamId,
      riotId,
      message,
    }: {
      teamId: string;
      riotId?: string;
      message?: string;
    }) => {
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");

      const { data, error } = await supabase
        .from("team_join_requests")
        .insert({
          team_id: teamId,
          user_id: user.id,
          riot_id: riotId,
          message,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["join-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-join-requests"] });
      toast.success("تم إرسال طلب الانضمام بنجاح");
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.error("لقد أرسلت طلب انضمام لهذا الفريق مسبقاً");
      } else {
        toast.error(error.message || "حدث خطأ أثناء إرسال الطلب");
      }
    },
  });
}

export function useRespondToJoinRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
      teamId,
    }: {
      requestId: string;
      status: "approved" | "rejected";
      teamId: string;
    }) => {
      // First update the request status
      const { data: request, error: updateError } = await supabase
        .from("team_join_requests")
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId)
        .select()
        .single();

      if (updateError) throw updateError;

      // If approved, add user to team
      if (status === "approved") {
        const { error: memberError } = await supabase
          .from("team_members")
          .insert({
            team_id: teamId,
            user_id: request.user_id,
            riot_id: request.riot_id,
            role: "player",
          });

        if (memberError) throw memberError;
      }

      return request;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["join-requests"] });
      queryClient.invalidateQueries({ queryKey: ["my-join-requests"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success(
        variables.status === "approved" ? "تم قبول اللاعب" : "تم رفض الطلب"
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ");
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      teamId,
    }: {
      memberId: string;
      teamId: string;
    }) => {
      // Return the deleted row so we can invalidate specific queries
      const { data, error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: (deleted: any, variables) => {
      // Invalidate the team-specific members query so the team view updates
      if (variables?.teamId) {
        queryClient.invalidateQueries({ queryKey: ["team-members", variables.teamId] });
      }

      // Invalidate general teams list and team detail
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      if (variables?.teamId) {
        queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
      }

      // If we know which user was removed, invalidate their `my-teams` cache
      if (deleted?.user_id) {
        queryClient.invalidateQueries({ queryKey: ["my-teams", deleted.user_id] });
        queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      } else {
        // Fallback: invalidate all my-teams queries
        queryClient.invalidateQueries({ queryKey: ["my-teams"] });
      }

      toast.success("تم إزالة اللاعب من الفريق");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ");
    },
  });
}
