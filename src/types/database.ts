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
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          primary_color: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          primary_color?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          primary_color?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          organization_id: string
          name: string
          requires_license: boolean
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          requires_license?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          requires_license?: boolean
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          organization_id: string
          name: string
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          address?: string | null
          created_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          organization_id: string
          auth_user_id: string | null
          email: string
          phone: string | null
          first_name: string
          last_name: string
          role_id: string | null
          is_manager: boolean
          manager_role_id: string | null
          status: string
          preferences: Json
          compliance_override: Json | null
          is_minor: boolean
          contract_type: string
          max_weekly_hours: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          auth_user_id?: string | null
          email: string
          phone?: string | null
          first_name: string
          last_name: string
          role_id?: string | null
          is_manager?: boolean
          manager_role_id?: string | null
          status?: string
          preferences?: Json
          compliance_override?: Json | null
          is_minor?: boolean
          contract_type?: string
          max_weekly_hours?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          auth_user_id?: string | null
          email?: string
          phone?: string | null
          first_name?: string
          last_name?: string
          role_id?: string | null
          is_manager?: boolean
          manager_role_id?: string | null
          status?: string
          preferences?: Json
          compliance_override?: Json | null
          is_minor?: boolean
          contract_type?: string
          max_weekly_hours?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          organization_id: string
          week_start: string
          status: string
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          week_start: string
          status?: string
          published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          week_start?: string
          status?: string
          published_at?: string | null
          created_at?: string
        }
      }
      shifts: {
        Row: {
          id: string
          schedule_id: string
          staff_id: string | null
          role_id: string | null
          location_id: string | null
          date: string
          start_time: string
          end_time: string
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          schedule_id: string
          staff_id?: string | null
          role_id?: string | null
          location_id?: string | null
          date: string
          start_time: string
          end_time: string
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          schedule_id?: string
          staff_id?: string | null
          role_id?: string | null
          location_id?: string | null
          date?: string
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
      open_shifts: {
        Row: {
          id: string
          organization_id: string
          role_id: string | null
          location_id: string | null
          date: string
          start_time: string
          end_time: string
          assignment_type: string
          status: string
          filled_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          role_id?: string | null
          location_id?: string | null
          date: string
          start_time: string
          end_time: string
          assignment_type?: string
          status?: string
          filled_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          role_id?: string | null
          location_id?: string | null
          date?: string
          start_time?: string
          end_time?: string
          assignment_type?: string
          status?: string
          filled_by?: string | null
          created_at?: string
        }
      }
      vacation_requests: {
        Row: {
          id: string
          staff_id: string
          start_date: string
          end_date: string
          start_time: string | null
          end_time: string | null
          hours_requested: number | null
          pto_type: string
          reason: string | null
          status: string
          manager_note: string | null
          created_at: string
          decided_at: string | null
        }
        Insert: {
          id?: string
          staff_id: string
          start_date: string
          end_date: string
          start_time?: string | null
          end_time?: string | null
          hours_requested?: number | null
          pto_type?: string
          reason?: string | null
          status?: string
          manager_note?: string | null
          created_at?: string
          decided_at?: string | null
        }
        Update: {
          id?: string
          staff_id?: string
          start_date?: string
          end_date?: string
          start_time?: string | null
          end_time?: string | null
          hours_requested?: number | null
          pto_type?: string
          reason?: string | null
          status?: string
          manager_note?: string | null
          created_at?: string
          decided_at?: string | null
        }
      }
      assets: {
        Row: {
          id: string
          organization_id: string
          asset_type_id: string
          name: string
          identifier: string | null
          status: string
          capacity: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          asset_type_id: string
          name: string
          identifier?: string | null
          status?: string
          capacity?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          asset_type_id?: string
          name?: string
          identifier?: string | null
          status?: string
          capacity?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      timesheets: {
        Row: {
          id: string
          organization_id: string
          staff_id: string
          pay_period_start: string
          pay_period_end: string
          total_regular_hours: number
          total_overtime_hours: number
          total_pto_hours: number
          status: string
          staff_signature: string | null
          staff_signed_at: string | null
          staff_ip_address: string | null
          manager_signature: string | null
          manager_signed_at: string | null
          manager_id: string | null
          manager_ip_address: string | null
          locked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          staff_id: string
          pay_period_start: string
          pay_period_end: string
          total_regular_hours?: number
          total_overtime_hours?: number
          total_pto_hours?: number
          status?: string
          staff_signature?: string | null
          staff_signed_at?: string | null
          staff_ip_address?: string | null
          manager_signature?: string | null
          manager_signed_at?: string | null
          manager_id?: string | null
          manager_ip_address?: string | null
          locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          staff_id?: string
          pay_period_start?: string
          pay_period_end?: string
          total_regular_hours?: number
          total_overtime_hours?: number
          total_pto_hours?: number
          status?: string
          staff_signature?: string | null
          staff_signed_at?: string | null
          staff_ip_address?: string | null
          manager_signature?: string | null
          manager_signed_at?: string | null
          manager_id?: string | null
          manager_ip_address?: string | null
          locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          organization_id: string
          actor_id: string
          action: string
          entity_type: string
          entity_id: string | null
          changes: Json | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          actor_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          changes?: Json | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          actor_id?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          changes?: Json | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Organization = Database['public']['Tables']['organizations']['Row']
export type Staff = Database['public']['Tables']['staff']['Row']
export type Role = Database['public']['Tables']['roles']['Row']
export type Location = Database['public']['Tables']['locations']['Row']
export type Schedule = Database['public']['Tables']['schedules']['Row']
export type Shift = Database['public']['Tables']['shifts']['Row']
export type OpenShift = Database['public']['Tables']['open_shifts']['Row']
export type VacationRequest = Database['public']['Tables']['vacation_requests']['Row']
export type Asset = Database['public']['Tables']['assets']['Row']
export type Timesheet = Database['public']['Tables']['timesheets']['Row']
export type ActivityLog = Database['public']['Tables']['activity_log']['Row']
