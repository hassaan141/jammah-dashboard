export interface Database {
  public: {
    Tables: {
      organization_applications: {
        Row: {
          id: string
          organization_name: string
          organization_type: string
          contact_name: string
          contact_email: string
          website?: string
          social_links?: string
          justification: string
          file_upload_url?: string
          status: 'submitted' | 'in_review' | 'approved' | 'rejected'
          admin_notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_name: string
          organization_type: string
          contact_name: string
          contact_email: string
          website?: string
          social_links?: string
          justification: string
          file_upload_url?: string
          status?: 'submitted' | 'in_review' | 'approved' | 'rejected'
          admin_notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_name?: string
          organization_type?: string
          contact_name?: string
          contact_email?: string
          website?: string
          social_links?: string
          justification?: string
          file_upload_url?: string
          status?: 'submitted' | 'in_review' | 'approved' | 'rejected'
          admin_notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          display_name: string
          type: string
          logo_url?: string
          banner_url?: string
          bio?: string
          city?: string
          country?: string
          website?: string
          email?: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          type: string
          logo_url?: string
          banner_url?: string
          bio?: string
          city?: string
          country?: string
          website?: string
          email?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          type?: string
          logo_url?: string
          banner_url?: string
          bio?: string
          city?: string
          country?: string
          website?: string
          email?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      organization_admins: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'owner' | 'admin'
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          organization_id: string
          title: string
          description: string
          start_time: string
          end_time: string
          venue: string
          image_url?: string
          status: 'draft' | 'published' | 'unpublished'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          title: string
          description: string
          start_time: string
          end_time: string
          venue: string
          image_url?: string
          status?: 'draft' | 'published' | 'unpublished'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          title?: string
          description?: string
          start_time?: string
          end_time?: string
          venue?: string
          image_url?: string
          status?: 'draft' | 'published' | 'unpublished'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      event_notifications: {
        Row: {
          id: string
          event_id: string
          organization_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          organization_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          organization_id?: string
          created_at?: string
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
  }
}
