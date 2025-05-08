
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          patientId: string
          providerId: string
          date: string
          time: string
          status?: string
          type: string
          location: string
        }
        Insert: {
          id?: string
          patientId: string
          providerId: string
          date: string
          time: string
          status?: string
          type: string
          location: string
        }
        Update: {
          id?: string
          patientId?: string
          providerId?: string
          date?: string
          time?: string
          status?: string
          type?: string
          location?: string
        }
      }
      body_analysis: {
        Row: {
          id: string
          userId: string
          createdAt: string
          data: Json
          sessionId?: string
          sessionType: string
          notes?: string
        }
        Insert: {
          id?: string
          userId: string
          createdAt?: string
          data: Json
          sessionId?: string
          sessionType: string
          notes?: string
        }
        Update: {
          id?: string
          userId?: string
          createdAt?: string
          data?: Json
          sessionId?: string
          sessionType?: string
          notes?: string
        }
      }
      exercise_sessions: {
        Row: {
          id: string
          userId: string
          exerciseId: string
          startTime: string
          endTime?: string
          data: Json
          status: string
        }
        Insert: {
          id?: string
          userId: string
          exerciseId: string
          startTime?: string
          endTime?: string
          data?: Json
          status?: string
        }
        Update: {
          id?: string
          userId?: string
          exerciseId?: string
          startTime?: string
          endTime?: string
          data?: Json
          status?: string
        }
      }
      fitness_connections: {
        Row: {
          id: string
          userId: string
          providerName: string
          providerUserId: string
          accessToken: string
          refreshToken?: string
          expiresAt?: string
          createdAt: string
          lastSyncedAt?: string
          status: string
        }
        Insert: {
          id?: string
          userId: string
          providerName: string
          providerUserId: string
          accessToken: string
          refreshToken?: string
          expiresAt?: string
          createdAt?: string
          lastSyncedAt?: string
          status?: string
        }
        Update: {
          id?: string
          userId?: string
          providerName?: string
          providerUserId?: string
          accessToken?: string
          refreshToken?: string
          expiresAt?: string
          createdAt?: string
          lastSyncedAt?: string
          status?: string
        }
      }
      fitness_data: {
        Row: {
          id: string
          userId: string
          dataType: string
          date: string
          value: number
          unit: string
          source: string
          metadata?: Json
          createdAt: string
        }
        Insert: {
          id?: string
          userId: string
          dataType: string
          date: string
          value: number
          unit: string
          source: string
          metadata?: Json
          createdAt?: string
        }
        Update: {
          id?: string
          userId?: string
          dataType?: string
          date?: string
          value?: number
          unit?: string
          source?: string
          metadata?: Json
          createdAt?: string
        }
      }
      analysis_sessions: {
        Row: {
          id: string
          userId: string
          sessionType: string
          startTime: string
          endTime?: string
          data: Json
          status: string
          notes?: string
        }
        Insert: {
          id?: string
          userId: string
          sessionType: string
          startTime?: string
          endTime?: string
          data?: Json
          status?: string
          notes?: string
        }
        Update: {
          id?: string
          userId?: string
          sessionType?: string
          startTime?: string
          endTime?: string
          data?: Json
          status?: string
          notes?: string
        }
      }
      messages: {
        Row: {
          id: string
          senderId: string
          receiverId: string
          content: string
          createdAt: string
          isRead: boolean
        }
        Insert: {
          id?: string
          senderId: string
          receiverId: string
          content: string
          createdAt?: string
          isRead?: boolean
        }
        Update: {
          id?: string
          senderId?: string
          receiverId?: string
          content?: string
          createdAt?: string
          isRead?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          avatar_url?: string
          createdAt: string
        }
        Insert: {
          id: string
          email: string
          name?: string
          role?: string
          avatar_url?: string
          createdAt?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          avatar_url?: string
          createdAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
