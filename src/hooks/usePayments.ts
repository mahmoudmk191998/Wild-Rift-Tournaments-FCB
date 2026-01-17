import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface Payment {
  id: string;
  user_id: string;
  team_id: string;
  tournament_id: string;
  amount: number;
  screenshot_url: string | null;
  payment_method: string;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    riot_id: string | null;
  };
  teams?: {
    name: string;
  };
  tournaments?: {
    name: string;
  };
}

export function usePayments(filter?: string) {
  return useQuery({
    queryKey: ["payments", filter],
    queryFn: async () => {
      // Fetch payments with direct FK joins (teams, tournaments).
      // We cannot rely on a PostgREST relationship to `profiles` here
      // because `payments.user_id` references `auth.users`, while
      // `profiles.user_id` also references `auth.users` (no direct FK
      // between payments and profiles), which causes REST select errors.
      let paymentsQuery = supabase
        .from("payments")
        .select(`
          *,
          teams:team_id ( name ),
          tournaments:tournament_id ( name )
        `)
        .order("created_at", { ascending: false });

      if (filter && filter !== "all") {
        paymentsQuery = paymentsQuery.eq("status", filter as any);
      }

      const { data: paymentsData, error: paymentsError } = await paymentsQuery;
      if (paymentsError) throw paymentsError;

      const payments = (paymentsData || []) as Payment[];

      // Collect unique user_ids and fetch profiles in a separate query
      const userIds = Array.from(new Set(payments.map((p) => p.user_id).filter(Boolean)));
      let profilesMap: Record<string, { username: string; riot_id: string | null }> = {};
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("user_id, username, riot_id")
          .in("user_id", userIds as any[]);

        if (profilesError) throw profilesError;

        (profilesData || []).forEach((pr: any) => {
          profilesMap[pr.user_id] = { username: pr.username, riot_id: pr.riot_id };
        });
      }

      // Attach profile info to each payment
      const merged = payments.map((p) => ({
        ...p,
        profiles: profilesMap[p.user_id] || undefined,
      }));

      // For private storage, create signed URLs for screenshots if needed
      await Promise.all(
        merged.map(async (p) => {
          if (p.screenshot_url && !p.screenshot_url.startsWith("http")) {
            const { data: signed, error: signErr } = await supabase.storage
              .from("payment-screenshots")
              .createSignedUrl(p.screenshot_url, 60 * 60);
            if (!signErr && signed?.signedUrl) {
              p.screenshot_url = signed.signedUrl as any;
              // eslint-disable-next-line no-console
              console.debug("[usePayments] signed screenshot:", p.id, p.screenshot_url);
            } else {
              // eslint-disable-next-line no-console
              console.debug("[usePayments] failed to create signed URL:", p.id, signErr);
              // Fallback: try to download the object and create a blob URL
              try {
                const { data: blob, error: dlErr } = await supabase.storage
                  .from("payment-screenshots")
                  .download(p.screenshot_url);
                if (!dlErr && blob) {
                  const objectUrl = URL.createObjectURL(blob as any);
                  p.screenshot_url = objectUrl as any;
                  // eslint-disable-next-line no-console
                  console.debug("[usePayments] created blob URL fallback:", p.id, p.screenshot_url);
                } else {
                  // eslint-disable-next-line no-console
                  console.debug("[usePayments] download fallback failed:", p.id, dlErr);
                }
              } catch (ex) {
                // eslint-disable-next-line no-console
                console.debug("[usePayments] download exception:", p.id, ex);
              }
            }
          }
        })
      );

      return merged as Payment[];
    },
  });
}

export function useMyPayments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-payments", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          teams:team_id (
            name
          ),
          tournaments:tournament_id (
            name
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const payments = (data || []) as Payment[];

      // If screenshot_url is a storage path (not a full http url), create signed URLs
      await Promise.all(
        payments.map(async (p) => {
          if (p.screenshot_url && !p.screenshot_url.startsWith("http")) {
            const { data: signed, error: signErr } = await supabase.storage
              .from("payment-screenshots")
              .createSignedUrl(p.screenshot_url, 60 * 60);
            if (!signErr && signed?.signedUrl) {
              p.screenshot_url = signed.signedUrl as any;
              // eslint-disable-next-line no-console
              console.debug("[useMyPayments] signed screenshot:", p.id, p.screenshot_url);
            } else {
              // eslint-disable-next-line no-console
              console.debug("[useMyPayments] failed to create signed URL:", p.id, signErr);
            }
          }
        })
      );

      return payments;
    },
    enabled: !!user,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      teamId,
      tournamentId,
      amount,
      screenshotUrl,
      paymentMethod,
    }: {
      teamId: string;
      tournamentId: string;
      amount: number;
      screenshotUrl: string;
      paymentMethod: string;
    }) => {
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");

      const { data, error } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          team_id: teamId,
          tournament_id: tournamentId,
          amount,
          screenshot_url: screenshotUrl,
          payment_method: paymentMethod,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      toast.success("تم رفع إيصال الدفع بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء رفع الإيصال");
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      adminNotes,
    }: {
      id: string;
      status: "approved" | "rejected";
      adminNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from("payments")
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // If payment was approved, mark the team as registered
      if (status === "approved" && data?.team_id) {
        try {
          await supabase
            .from("teams")
            .update({ status: "registered" })
            .eq("id", data.team_id);
        } catch (e) {
          // ignore
        }
      }

      // If payment was rejected, ban the user (set profile.is_banned = true)
      if (status === "rejected" && data?.user_id) {
        try {
          await supabase
            .from("profiles")
            .update({ is_banned: true })
            .eq("user_id", data.user_id);
        } catch (e) {
          // ignore
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("تم تحديث حالة الدفع");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث الحالة");
    },
  });
}

export async function uploadPaymentScreenshot(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("payment-screenshots")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Return the storage path (not a public URL). For private buckets we
  // will generate signed URLs when needed (server or client) so the
  // stored value is canonical and compatible with storage policies.
  return fileName;
}
