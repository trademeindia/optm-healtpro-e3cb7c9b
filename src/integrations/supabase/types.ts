export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analysis_sessions: {
        Row: {
          created_at: string
          end_time: string | null
          exercise_type: string
          id: string
          notes: string | null
          patient_id: string
          start_time: string
          summary: Json | null
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          exercise_type: string
          id?: string
          notes?: string | null
          patient_id: string
          start_time?: string
          summary?: Json | null
        }
        Update: {
          created_at?: string
          end_time?: string | null
          exercise_type?: string
          id?: string
          notes?: string | null
          patient_id?: string
          start_time?: string
          summary?: Json | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_type: string
          created_at: string
          date: string
          doctor_id: string
          duration: number
          id: string
          location: string | null
          notes: string | null
          patient_id: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_type: string
          created_at?: string
          date: string
          doctor_id: string
          duration?: number
          id?: string
          location?: string | null
          notes?: string | null
          patient_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          created_at?: string
          date?: string
          doctor_id?: string
          duration?: number
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      body_analysis: {
        Row: {
          angles: Json
          biomarkers: Json | null
          created_at: string
          id: string
          metadata: Json | null
          patient_id: string
          posture_score: number | null
          session_id: string
          timestamp: string
        }
        Insert: {
          angles: Json
          biomarkers?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          patient_id: string
          posture_score?: number | null
          session_id: string
          timestamp?: string
        }
        Update: {
          angles?: Json
          biomarkers?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          patient_id?: string
          posture_score?: number | null
          session_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      exercise_sessions: {
        Row: {
          angles: Json
          created_at: string
          exercise_type: string
          id: string
          notes: string | null
          patient_id: string
          timestamp: string
        }
        Insert: {
          angles: Json
          created_at?: string
          exercise_type: string
          id?: string
          notes?: string | null
          patient_id: string
          timestamp?: string
        }
        Update: {
          angles?: Json
          created_at?: string
          exercise_type?: string
          id?: string
          notes?: string | null
          patient_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      fitness_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          last_sync: string | null
          provider: string
          refresh_token: string
          scope: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          last_sync?: string | null
          provider: string
          refresh_token: string
          scope: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          last_sync?: string | null
          provider?: string
          refresh_token?: string
          scope?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fitness_data: {
        Row: {
          created_at: string
          data_type: string
          end_time: string
          id: string
          metadata: Json | null
          source: string
          start_time: string
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          data_type: string
          end_time: string
          id?: string
          metadata?: Json | null
          source: string
          start_time: string
          unit: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          data_type?: string
          end_time?: string
          id?: string
          metadata?: Json | null
          source?: string
          start_time?: string
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string
          id: string
          name: string | null
          picture: string | null
          provider: string
          role: string
        }
        Insert: {
          email: string
          id: string
          name?: string | null
          picture?: string | null
          provider?: string
          role?: string
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          picture?: string | null
          provider?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_appointment_status: {
        Args: { appointment_id: string; new_status: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
