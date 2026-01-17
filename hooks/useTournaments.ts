import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  max_teams: number;
  team_size: number;
  entry_fee: number;
  platform_fee_percentage: number;
  tournament_type: "group_knockout" | "single_elimination";
  match_type: "bo1" | "bo3" | "bo5";
  status: "upcoming" | "registration_open" | "registration_closed" | "in_progress" | "completed" | "cancelled";
  num_groups: number | null;
  teams_per_group_qualify: number | null;
  prize_pool: number | null;
  prize_distribution: any;
  is_locked: boolean;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useTournaments(filter?: string) {
  return useQuery({
    queryKey: ["tournaments", filter],
    queryFn: async () => {
      let query = supabase
        .from("tournaments")
        .select("*")
        .order("start_date", { ascending: true });

      if (filter && filter !== "all") {
        query = query.eq("status", filter as any);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Tournament[];
    },
  });
}

export function useTournament(id: string | undefined) {
  return useQuery({
    queryKey: ["tournament", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Tournament | null;
    },
    enabled: !!id,
  });
}

export function useCreateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tournament: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("tournaments")
        .insert(tournament as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast.success("تم إنشاء البطولة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء البطولة");
    },
  });
}

export function useUpdateTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Tournament> & { id: string }) => {
      const { data, error } = await supabase
        .from("tournaments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["tournament", data.id] });
      toast.success("تم تحديث البطولة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث البطولة");
    },
  });
}

export function useDeleteTournament() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tournaments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      toast.success("تم حذف البطولة بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حذف البطولة");
    },
  });
}
