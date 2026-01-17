export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_standings: {
        Row: {
          created_at: string
          draws: number | null
          games_played: number | null
          group_id: string
          id: string
          is_qualified: boolean | null
          losses: number | null
          points: number | null
          team_id: string
          updated_at: string
          wins: number | null
        }
        Insert: {
          created_at?: string
          draws?: number | null
          games_played?: number | null
          group_id: string
          id?: string
          is_qualified?: boolean | null
          losses?: number | null
          points?: number | null
          team_id: string
          updated_at?: string
          wins?: number | null
        }
        Update: {
          created_at?: string
          draws?: number | null
          games_played?: number | null
          group_id?: string
          id?: string
          is_qualified?: boolean | null
          losses?: number | null
          points?: number | null
          team_id?: string
          updated_at?: string
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_standings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          id: string
          name: string
          tournament_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          tournament_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          admin_notes: string | null
          bracket_position: number | null
          bracket_round: number | null
          created_at: string
          group_id: string | null
          id: string
          is_completed: boolean | null
          match_type: Database["public"]["Enums"]["match_type"]
          played_at: string | null
          scheduled_at: string | null
          stage: string | null
          team1_id: string | null
          team1_score: number | null
          team2_id: string | null
          team2_score: number | null
          tournament_id: string
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          bracket_position?: number | null
          bracket_round?: number | null
          created_at?: string
          group_id?: string | null
          id?: string
          is_completed?: boolean | null
          match_type?: Database["public"]["Enums"]["match_type"]
          played_at?: string | null
          scheduled_at?: string | null
          stage?: string | null
          team1_id?: string | null
          team1_score?: number | null
          team2_id?: string | null
          team2_score?: number | null
          tournament_id: string
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          bracket_position?: number | null
          bracket_round?: number | null
          created_at?: string
          group_id?: string | null
          id?: string
          is_completed?: boolean | null
          match_type?: Database["public"]["Enums"]["match_type"]
          played_at?: string | null
          scheduled_at?: string | null
          stage?: string | null
          team1_id?: string | null
          team1_score?: number | null
          team2_id?: string | null
          team2_score?: number | null
          tournament_id?: string
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team1_id_fkey"
            columns: ["team1_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team2_id_fkey"
            columns: ["team2_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          payment_method: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          screenshot_url: string | null
          status: Database["public"]["Enums"]["payment_status"]
          team_id: string
          tournament_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          payment_method?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          team_id: string
          tournament_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          payment_method?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          screenshot_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          team_id?: string
          tournament_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_banned: boolean | null
          rank: string | null
          riot_id: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_banned?: boolean | null
          rank?: string | null
          riot_id?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_banned?: boolean | null
          rank?: string | null
          riot_id?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: string | null
          created_at: string
          id: string
          key: string
          metadata: Json | null
          title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          key: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          key?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      team_join_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          riot_id: string | null
          status: string
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          riot_id?: string | null
          status?: string
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          riot_id?: string | null
          status?: string
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_join_requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          riot_id: string | null
          role: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          riot_id?: string | null
          role?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          riot_id?: string | null
          role?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          captain_id: string | null
          created_at: string
          group_name: string | null
          id: string
          is_locked: boolean | null
          logo_url: string | null
          name: string
          status: Database["public"]["Enums"]["team_status"]
          tournament_id: string
          updated_at: string
        }
        Insert: {
          captain_id?: string | null
          created_at?: string
          group_name?: string | null
          id?: string
          is_locked?: boolean | null
          logo_url?: string | null
          name: string
          status?: Database["public"]["Enums"]["team_status"]
          tournament_id: string
          updated_at?: string
        }
        Update: {
          captain_id?: string | null
          created_at?: string
          group_name?: string | null
          id?: string
          is_locked?: boolean | null
          logo_url?: string | null
          name?: string
          status?: Database["public"]["Enums"]["team_status"]
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          end_date: string | null
          entry_fee: number
          id: string
          is_locked: boolean | null
          match_type: Database["public"]["Enums"]["match_type"]
          max_teams: number
          name: string
          num_groups: number | null
          platform_fee_percentage: number
          prize_distribution: Json | null
          prize_pool: number | null
          start_date: string
          status: Database["public"]["Enums"]["tournament_status"]
          team_size: number
          teams_per_group_qualify: number | null
          tournament_type: Database["public"]["Enums"]["tournament_type"]
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          entry_fee?: number
          id?: string
          is_locked?: boolean | null
          match_type?: Database["public"]["Enums"]["match_type"]
          max_teams?: number
          name: string
          num_groups?: number | null
          platform_fee_percentage?: number
          prize_distribution?: Json | null
          prize_pool?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["tournament_status"]
          team_size?: number
          teams_per_group_qualify?: number | null
          tournament_type?: Database["public"]["Enums"]["tournament_type"]
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          entry_fee?: number
          id?: string
          is_locked?: boolean | null
          match_type?: Database["public"]["Enums"]["match_type"]
          max_teams?: number
          name?: string
          num_groups?: number | null
          platform_fee_percentage?: number
          prize_distribution?: Json | null
          prize_pool?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["tournament_status"]
          team_size?: number
          teams_per_group_qualify?: number | null
          tournament_type?: Database["public"]["Enums"]["tournament_type"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      match_type: "bo1" | "bo3" | "bo5"
      payment_status: "pending" | "approved" | "rejected"
      team_status:
        | "incomplete"
        | "pending_payment"
        | "registered"
        | "qualified"
        | "eliminated"
      tournament_status:
        | "upcoming"
        | "registration_open"
        | "registration_closed"
        | "in_progress"
        | "completed"
        | "cancelled"
      tournament_type: "group_knockout" | "single_elimination"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      match_type: ["bo1", "bo3", "bo5"],
      payment_status: ["pending", "approved", "rejected"],
      team_status: [
        "incomplete",
        "pending_payment",
        "registered",
        "qualified",
        "eliminated",
      ],
      tournament_status: [
        "upcoming",
        "registration_open",
        "registration_closed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      tournament_type: ["group_knockout", "single_elimination"],
    },
  },
} as const
