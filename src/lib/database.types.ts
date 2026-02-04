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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'author' | 'buyer'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'author' | 'buyer'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'author' | 'buyer'
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          author_id: string
          title: string
          description: string | null
          price: number
          cover_url: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          description?: string | null
          price?: number
          cover_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          description?: string | null
          price?: number
          cover_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          order?: number
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          content: string | null
          video_url: string | null
          type: 'video' | 'text' | 'quiz'
          order: number
          is_free: boolean
          created_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          content?: string | null
          video_url?: string | null
          type?: 'video' | 'text' | 'quiz'
          order?: number
          is_free?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          content?: string | null
          video_url?: string | null
          type?: 'video' | 'text' | 'quiz'
          order?: number
          is_free?: boolean
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          created_at?: string
        }
      }
    }
  }
}
