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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      exercise_muscles: {
        Row: {
          contribution: number
          created_at: string
          exercise_id: string
          muscle_id: string
          role: Database["public"]["Enums"]["muscle_role"]
          updated_at: string
        }
        Insert: {
          contribution?: number
          created_at?: string
          exercise_id: string
          muscle_id: string
          role?: Database["public"]["Enums"]["muscle_role"]
          updated_at?: string
        }
        Update: {
          contribution?: number
          created_at?: string
          exercise_id?: string
          muscle_id?: string
          role?: Database["public"]["Enums"]["muscle_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_muscles_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_muscles_muscle_id_fkey"
            columns: ["muscle_id"]
            isOneToOne: false
            referencedRelation: "muscles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sets: {
        Row: {
          created_at: string
          distance: number | null
          duration: number | null
          id: string
          notes: string | null
          one_rep_max_percent: number | null
          params: Json | null
          per_side: boolean
          rep_scheme: string | null
          reps: number | null
          reps_max: number | null
          rest: number | null
          rir: number | null
          rpe: number | null
          set_index: number
          set_type: Database["public"]["Enums"]["set_type"]
          updated_at: string
          workout_exercise_id: string
        }
        Insert: {
          created_at?: string
          distance?: number | null
          duration?: number | null
          id?: string
          notes?: string | null
          one_rep_max_percent?: number | null
          params?: Json | null
          per_side?: boolean
          rep_scheme?: string | null
          reps?: number | null
          reps_max?: number | null
          rest?: number | null
          rir?: number | null
          rpe?: number | null
          set_index: number
          set_type?: Database["public"]["Enums"]["set_type"]
          updated_at?: string
          workout_exercise_id: string
        }
        Update: {
          created_at?: string
          distance?: number | null
          duration?: number | null
          id?: string
          notes?: string | null
          one_rep_max_percent?: number | null
          params?: Json | null
          per_side?: boolean
          rep_scheme?: string | null
          reps?: number | null
          reps_max?: number | null
          rest?: number | null
          rir?: number | null
          rpe?: number | null
          set_index?: number
          set_type?: Database["public"]["Enums"]["set_type"]
          updated_at?: string
          workout_exercise_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sets_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          aliases: string[] | null
          ballistic: boolean | null
          base_calorie_cost: number | null
          category: string | null
          cns_demand: number | null
          compound: boolean | null
          contra_indications: string[] | null
          created_at: string
          cues: string[] | null
          energy_system: string | null
          equipment: string[] | null
          external_links: Json | null
          fatigue_index: number | null
          force_curve: string | null
          id: string
          ideal_rep_range: number[] | null
          image_url: string | null
          intensity_ceiling: number | null
          joint_stress: number | null
          load_profile: string | null
          metabolic_demand: number | null
          movement_plane: string | null
          name: string
          recovery_days: number | null
          rom_rating: string | null
          skill_requirement: string | null
          tracking_type: string[]
          unilateral: boolean | null
          updated_at: string
          variations: string[] | null
          volume_per_set: Json | null
        }
        Insert: {
          aliases?: string[] | null
          ballistic?: boolean | null
          base_calorie_cost?: number | null
          category?: string | null
          cns_demand?: number | null
          compound?: boolean | null
          contra_indications?: string[] | null
          created_at?: string
          cues?: string[] | null
          energy_system?: string | null
          equipment?: string[] | null
          external_links?: Json | null
          fatigue_index?: number | null
          force_curve?: string | null
          id: string
          ideal_rep_range?: number[] | null
          image_url?: string | null
          intensity_ceiling?: number | null
          joint_stress?: number | null
          load_profile?: string | null
          metabolic_demand?: number | null
          movement_plane?: string | null
          name: string
          recovery_days?: number | null
          rom_rating?: string | null
          skill_requirement?: string | null
          tracking_type?: string[]
          unilateral?: boolean | null
          updated_at?: string
          variations?: string[] | null
          volume_per_set?: Json | null
        }
        Update: {
          aliases?: string[] | null
          ballistic?: boolean | null
          base_calorie_cost?: number | null
          category?: string | null
          cns_demand?: number | null
          compound?: boolean | null
          contra_indications?: string[] | null
          created_at?: string
          cues?: string[] | null
          energy_system?: string | null
          equipment?: string[] | null
          external_links?: Json | null
          fatigue_index?: number | null
          force_curve?: string | null
          id?: string
          ideal_rep_range?: number[] | null
          image_url?: string | null
          intensity_ceiling?: number | null
          joint_stress?: number | null
          load_profile?: string | null
          metabolic_demand?: number | null
          movement_plane?: string | null
          name?: string
          recovery_days?: number | null
          rom_rating?: string | null
          skill_requirement?: string | null
          tracking_type?: string[]
          unilateral?: boolean | null
          updated_at?: string
          variations?: string[] | null
          volume_per_set?: Json | null
        }
        Relationships: []
      }
      muscles: {
        Row: {
          created_at: string
          display_name: string
          group_name: string
          id: string
          movement_type: Database["public"]["Enums"]["muscle_movement_type"]
          region: Database["public"]["Enums"]["muscle_region"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          group_name: string
          id: string
          movement_type?: Database["public"]["Enums"]["muscle_movement_type"]
          region?: Database["public"]["Enums"]["muscle_region"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          group_name?: string
          id?: string
          movement_type?: Database["public"]["Enums"]["muscle_movement_type"]
          region?: Database["public"]["Enums"]["muscle_region"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      program_blocks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_num: number
          program_id: string
          updated_at: string
          week_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_num: number
          program_id: string
          updated_at?: string
          week_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_num?: number
          program_id?: string
          updated_at?: string
          week_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_blocks_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      program_days: {
        Row: {
          block_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          order_num: number
          program_id: string
          type: Database["public"]["Enums"]["day_type"]
          updated_at: string
          week_id: string | null
        }
        Insert: {
          block_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_num: number
          program_id: string
          type?: Database["public"]["Enums"]["day_type"]
          updated_at?: string
          week_id?: string | null
        }
        Update: {
          block_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_num?: number
          program_id?: string
          type?: Database["public"]["Enums"]["day_type"]
          updated_at?: string
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_days_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "program_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_days_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_days_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "program_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      program_weeks: {
        Row: {
          block_id: string
          created_at: string
          id: string
          label: string | null
          order_num: number
          updated_at: string
          week_number: number
        }
        Insert: {
          block_id: string
          created_at?: string
          id?: string
          label?: string | null
          order_num?: number
          updated_at?: string
          week_number?: number
        }
        Update: {
          block_id?: string
          created_at?: string
          id?: string
          label?: string | null
          order_num?: number
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_weeks_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "program_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          goal: Database["public"]["Enums"]["program_goal"]
          id: string
          is_template: boolean
          mode: Database["public"]["Enums"]["program_mode"]
          name: string
          parent_program_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          goal: Database["public"]["Enums"]["program_goal"]
          id?: string
          is_template?: boolean
          mode?: Database["public"]["Enums"]["program_mode"]
          name: string
          parent_program_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          goal?: Database["public"]["Enums"]["program_goal"]
          id?: string
          is_template?: boolean
          mode?: Database["public"]["Enums"]["program_mode"]
          name?: string
          parent_program_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_parent_program_id_fkey"
            columns: ["parent_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercise_groups: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_num: number
          program_day_id: string
          rest_after_group: number | null
          type: Database["public"]["Enums"]["group_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_num: number
          program_day_id: string
          rest_after_group?: number | null
          type: Database["public"]["Enums"]["group_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_num?: number
          program_day_id?: string
          rest_after_group?: number | null
          type?: Database["public"]["Enums"]["group_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercise_groups_program_day_id_fkey"
            columns: ["program_day_id"]
            isOneToOne: false
            referencedRelation: "program_days"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercises: {
        Row: {
          created_at: string
          display_name: string
          exercise_id: string
          id: string
          intensity: Database["public"]["Enums"]["intensity_system"]
          notes: string | null
          order_num: number
          rep_scheme: string
          updated_at: string
          workout_group_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          exercise_id: string
          id?: string
          intensity?: Database["public"]["Enums"]["intensity_system"]
          notes?: string | null
          order_num: number
          rep_scheme?: string
          updated_at?: string
          workout_group_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          exercise_id?: string
          id?: string
          intensity?: Database["public"]["Enums"]["intensity_system"]
          notes?: string | null
          order_num?: number
          rep_scheme?: string
          updated_at?: string
          workout_group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_group_id_fkey"
            columns: ["workout_group_id"]
            isOneToOne: false
            referencedRelation: "workout_exercise_groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clone_program_from_template: {
        Args: { template_program_id: string }
        Returns: string
      }
      is_program_accessible: {
        Args: { p_program_id: string }
        Returns: boolean
      }
      is_program_owner: { Args: { p_program_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      day_type: "workout" | "rest" | "active_rest" | "other"
      group_type: "standard" | "superset" | "giant_set" | "circuit"
      intensity_system: "rpe" | "one_rep_max_percent" | "rir" | "none"
      muscle_movement_type: "push" | "pull" | "neutral" | "abduction"
      muscle_region: "upper" | "lower" | "core"
      muscle_role: "prime" | "synergist" | "stabilizer"
      program_goal: "strength" | "hypertrophy" | "endurance" | "power"
      program_mode: "days" | "blocks"
      set_type:
        | "warmup"
        | "standard"
        | "amrap"
        | "drop"
        | "cluster"
        | "myo_reps"
        | "rest_pause"
        | "top_set"
        | "backoff"
        | "other"
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
      day_type: ["workout", "rest", "active_rest", "other"],
      group_type: ["standard", "superset", "giant_set", "circuit"],
      intensity_system: ["rpe", "one_rep_max_percent", "rir", "none"],
      muscle_movement_type: ["push", "pull", "neutral", "abduction"],
      muscle_region: ["upper", "lower", "core"],
      muscle_role: ["prime", "synergist", "stabilizer"],
      program_goal: ["strength", "hypertrophy", "endurance", "power"],
      program_mode: ["days", "blocks"],
      set_type: [
        "warmup",
        "standard",
        "amrap",
        "drop",
        "cluster",
        "myo_reps",
        "rest_pause",
        "top_set",
        "backoff",
        "other",
      ],
    },
  },
} as const

