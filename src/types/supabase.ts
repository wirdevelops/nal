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
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'guest' | 'authenticated' | 'staff' | 'admin'
          status: 'active' | 'suspended' | 'banned'
          bio: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'guest' | 'authenticated' | 'staff' | 'admin'
          status?: 'active' | 'suspended' | 'banned'
          bio?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'guest' | 'authenticated' | 'staff' | 'admin'
          status?: 'active' | 'suspended' | 'banned'
          bio?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
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
      user_role: 'guest' | 'authenticated' | 'staff' | 'admin'
      user_status: 'active' | 'suspended' | 'banned'
    }
  }
}
