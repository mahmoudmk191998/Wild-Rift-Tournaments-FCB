import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Group {
  id: string;
  tournament_id: string;
  name: string;
  created_at: string;
}

export interface GroupStanding {
  id: string;
  group_id: string;
  team_id: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  games_played: number;
  is_qualified: boolean;
  created_at: string;
  updated_at: string;
  teams?: {
    name: string;
  };
}

export function useGroups(tournamentId?: string) {
  return useQuery({
    queryKey: ["groups", tournamentId],
    queryFn: async () => {
      let query = supabase
        .from("groups")
        .select("*")
        .order("name", { ascending: true });

      if (tournamentId) {
        query = query.eq("tournament_id", tournamentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Group[];
    },
  });
}

export function useGroupStandings(groupId?: string) {
  return useQuery({
    queryKey: ["group-standings", groupId],
    queryFn: async () => {
      if (!groupId) return [];

      const { data, error } = await supabase
        .from("group_standings")
        .select(`
          *,
          teams:team_id (name)
        `)
        .eq("group_id", groupId)
        .order("points", { ascending: false });

      if (error) throw error;
      return data as GroupStanding[];
    },
    enabled: !!groupId,
  });
}

export function useCreateGroups() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tournamentId,
      numGroups,
    }: {
      tournamentId: string;
      numGroups: number;
    }) => {
      const groups = [];
      for (let i = 0; i < numGroups; i++) {
        groups.push({
          tournament_id: tournamentId,
          name: `المجموعة ${String.fromCharCode(65 + i)}`,
        });
      }

      const { data, error } = await supabase
        .from("groups")
        .insert(groups)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("تم إنشاء المجموعات");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء المجموعات");
    },
  });
}

export function useAssignTeamToGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teamId,
      groupId,
      groupName,
    }: {
      teamId: string;
      groupId: string;
      groupName: string;
    }) => {
      // Update team's group
      const { error: teamError } = await supabase
        .from("teams")
        .update({ group_name: groupName })
        .eq("id", teamId);

      if (teamError) throw teamError;

      // Create group standing
      const { data, error } = await supabase
        .from("group_standings")
        .insert({
          group_id: groupId,
          team_id: teamId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group-standings"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("تم إضافة الفريق للمجموعة");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ");
    },
  });
}

export function useUpdateStanding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<GroupStanding> & { id: string }) => {
      const { data, error } = await supabase
        .from("group_standings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-standings"] });
      toast.success("تم تحديث الترتيب");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ");
    },
  });
}
