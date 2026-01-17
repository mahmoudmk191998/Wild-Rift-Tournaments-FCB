import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Match {
  id: string;
  tournament_id: string;
  group_id: string | null;
  team1_id: string | null;
  team2_id: string | null;
  team1_score: number;
  team2_score: number;
  winner_id: string | null;
  match_type: "bo1" | "bo3" | "bo5";
  stage: string;
  bracket_round: number | null;
  bracket_position: number | null;
  scheduled_at: string | null;
  played_at: string | null;
  admin_notes: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  team1?: {
    name: string;
  };
  team2?: {
    name: string;
  };
}

export function useMatches(tournamentId?: string, stage?: string) {
  return useQuery({
    queryKey: ["matches", tournamentId, stage],
    queryFn: async () => {
      let query = supabase
        .from("matches")
        .select("*")
        .order("scheduled_at", { ascending: true });

      if (tournamentId) {
        query = query.eq("tournament_id", tournamentId);
      }

      if (stage) {
        query = query.eq("stage", stage);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Match[];
    },
  });
}

export function useUpdateMatchResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      team1Score,
      team2Score,
      winnerId,
    }: {
      id: string;
      team1Score: number;
      team2Score: number;
      winnerId: string | null;
    }) => {
      const { data, error } = await supabase
        .from("matches")
        .update({
          team1_score: team1Score,
          team2_score: team2Score,
          winner_id: winnerId,
          is_completed: true,
          played_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["group-standings"] });
      toast.success("تم تحديث نتيجة المباراة");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث النتيجة");
    },
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (match: Omit<Match, 'id' | 'created_at' | 'updated_at' | 'team1' | 'team2'>) => {
      const { data, error } = await supabase
        .from("matches")
        .insert(match)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("تم إنشاء المباراة");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء المباراة");
    },
  });
}
