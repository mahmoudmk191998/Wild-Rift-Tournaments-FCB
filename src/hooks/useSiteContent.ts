import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SiteContent {
  id: string;
  key: string;
  title: string | null;
  content: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export function useSiteContent(key: string) {
  return useQuery({
    queryKey: ["site_content", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("key", key)
        .maybeSingle();

      if (error) throw error;
      return data as SiteContent | null;
    },
  });
}

export function useAllSiteContent() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("key");

      if (error) throw error;
      return data as SiteContent[];
    },
  });
}

export function useUpdateSiteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      title,
      content,
      metadata,
    }: {
      key: string;
      title?: string;
      content?: string;
      metadata?: Record<string, any>;
    }) => {
      const { data: existing } = await supabase
        .from("site_content")
        .select("id")
        .eq("key", key)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from("site_content")
          .update({ title, content, metadata, updated_at: new Date().toISOString() })
          .eq("key", key)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("site_content")
          .insert({ key, title, content, metadata })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_content"] });
      toast.success("تم حفظ المحتوى بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حفظ المحتوى");
    },
  });
}
