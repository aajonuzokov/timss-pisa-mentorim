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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      books: {
        Row: {
          author: string
          category: string
          cover_image: string | null
          cover_url: string | null
          created_at: string
          description: string
          id: string
          order_index: number | null
          pdf_url: string | null
          reader_url: string | null
          sort_order: number
          source_url: string | null
          title: string
          year: number
        }
        Insert: {
          author: string
          category: string
          cover_image?: string | null
          cover_url?: string | null
          created_at?: string
          description: string
          id?: string
          order_index?: number | null
          pdf_url?: string | null
          reader_url?: string | null
          sort_order?: number
          source_url?: string | null
          title: string
          year: number
        }
        Update: {
          author?: string
          category?: string
          cover_image?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          order_index?: number | null
          pdf_url?: string | null
          reader_url?: string | null
          sort_order?: number
          source_url?: string | null
          title?: string
          year?: number
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      portfolio_pins: {
        Row: {
          code: string
          created_at: string
          failed: number
          locked_until: string | null
          pin_hash: string
        }
        Insert: {
          code: string
          created_at?: string
          failed?: number
          locked_until?: string | null
          pin_hash: string
        }
        Update: {
          code?: string
          created_at?: string
          failed?: number
          locked_until?: string | null
          pin_hash?: string
        }
        Relationships: []
      }
      portfolio_reflections: {
        Row: {
          code: string
          created_at: string
          difficulty: string
          id: string
          next_step: string
          result_id: string
          test_type: string
        }
        Insert: {
          code: string
          created_at?: string
          difficulty: string
          id?: string
          next_step: string
          result_id: string
          test_type: string
        }
        Update: {
          code?: string
          created_at?: string
          difficulty?: string
          id?: string
          next_step?: string
          result_id?: string
          test_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_reflections_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          authors: string
          created_at: string
          description: string
          id: string
          source: string
          title: string
          url: string | null
          year: number
        }
        Insert: {
          authors: string
          created_at?: string
          description: string
          id?: string
          source: string
          title: string
          url?: string | null
          year: number
        }
        Update: {
          authors?: string
          created_at?: string
          description?: string
          id?: string
          source?: string
          title?: string
          url?: string | null
          year?: number
        }
        Relationships: []
      }
      rubric_scores: {
        Row: {
          comment: string | null
          item_id: string
          rater: string | null
          result_id: string
          score: number
          updated_at: string
        }
        Insert: {
          comment?: string | null
          item_id: string
          rater?: string | null
          result_id: string
          score: number
          updated_at?: string
        }
        Update: {
          comment?: string | null
          item_id?: string
          rater?: string | null
          result_id?: string
          score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rubric_scores_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_feedback: {
        Row: {
          author: string | null
          code: string
          comment: string
          created_at: string
          id: string
          recommendations: string
          result_id: string | null
        }
        Insert: {
          author?: string | null
          code: string
          comment: string
          created_at?: string
          id?: string
          recommendations?: string
          result_id?: string | null
        }
        Update: {
          author?: string | null
          code?: string
          comment?: string
          created_at?: string
          id?: string
          recommendations?: string
          result_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_feedback_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          answers: Json
          completed_at: string
          course: string
          full_name: string
          id: string
          level: string
          percentage: number
          score: number
          started_at: string
          test_type: string
          total_questions: number
          university: string
        }
        Insert: {
          answers?: Json
          completed_at?: string
          course: string
          full_name: string
          id?: string
          level: string
          percentage: number
          score: number
          started_at: string
          test_type: string
          total_questions: number
          university: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          course?: string
          full_name?: string
          id?: string
          level?: string
          percentage?: number
          score?: number
          started_at?: string
          test_type?: string
          total_questions?: number
          university?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_teacher: { Args: never; Returns: boolean }
      portfolio_open: { Args: { p_code: string; p_pin: string }; Returns: Json }
      portfolio_pin_hash: {
        Args: { p_code: string; p_pin: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
