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
      users: {
        Row: {
          id: string
          email: string
          phone_number: string | null
          full_name: string | null
          gender: string | null
          date_of_birth: string | null
          interests: string[] | null
          employment_status: string | null
          monthly_income: number | null
          monthly_expenditure: number | null
          financial_exposure: number | null
          kyc_status: 'pending' | 'in_progress' | 'completed' | 'rejected'
          kyc_data: Json | null
          is_active: boolean
          email_verified: boolean
          phone_verified: boolean
          biometric_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          phone_number?: string | null
          full_name?: string | null
          gender?: string | null
          date_of_birth?: string | null
          interests?: string[] | null
          employment_status?: string | null
          monthly_income?: number | null
          monthly_expenditure?: number | null
          financial_exposure?: number | null
          kyc_status?: 'pending' | 'in_progress' | 'completed' | 'rejected'
          kyc_data?: Json | null
          is_active?: boolean
          email_verified?: boolean
          phone_verified?: boolean
          biometric_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone_number?: string | null
          full_name?: string | null
          gender?: string | null
          date_of_birth?: string | null
          interests?: string[] | null
          employment_status?: string | null
          monthly_income?: number | null
          monthly_expenditure?: number | null
          financial_exposure?: number | null
          kyc_status?: 'pending' | 'in_progress' | 'completed' | 'rejected'
          kyc_data?: Json | null
          is_active?: boolean
          email_verified?: boolean
          phone_verified?: boolean
          biometric_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      otp_verifications: {
        Row: {
          id: string
          user_id: string
          phone_number: string
          otp_code: string
          expires_at: string
          verified: boolean
          attempts: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone_number: string
          otp_code: string
          expires_at: string
          verified?: boolean
          attempts?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone_number?: string
          otp_code?: string
          expires_at?: string
          verified?: boolean
          attempts?: number
          created_at?: string
        }
      }
      roundup_settings: {
        Row: {
          id: string
          user_id: string
          is_enabled: boolean
          round_up_method: 'nearest_dollar' | 'custom_amount'
          custom_amount: number | null
          default_destination: 'investment' | 'charity'
          minimum_roundup: number
          maximum_roundup: number
          monthly_limit: number | null
          excluded_categories: string[]
          investment_allocation: Json | null
          charity_allocation: Json | null
          auto_invest_threshold: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          is_enabled?: boolean
          round_up_method?: 'nearest_dollar' | 'custom_amount'
          custom_amount?: number | null
          default_destination?: 'investment' | 'charity'
          minimum_roundup?: number
          maximum_roundup?: number
          monthly_limit?: number | null
          excluded_categories?: string[]
          investment_allocation?: Json | null
          charity_allocation?: Json | null
          auto_invest_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          is_enabled?: boolean
          round_up_method?: 'nearest_dollar' | 'custom_amount'
          custom_amount?: number | null
          default_destination?: 'investment' | 'charity'
          minimum_roundup?: number
          maximum_roundup?: number
          monthly_limit?: number | null
          excluded_categories?: string[]
          investment_allocation?: Json | null
          charity_allocation?: Json | null
          auto_invest_threshold?: number
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
      kyc_status: 'pending' | 'in_progress' | 'completed' | 'rejected'
      round_up_method: 'nearest_dollar' | 'custom_amount'
      destination_type: 'investment' | 'charity'
    }
  }
}

export type UserProfile = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type OTPVerification = Database['public']['Tables']['otp_verifications']['Row']
export type OTPInsert = Database['public']['Tables']['otp_verifications']['Insert']

export type RoundUpSettings = Database['public']['Tables']['roundup_settings']['Row']
export type RoundUpSettingsInsert = Database['public']['Tables']['roundup_settings']['Insert']
export type RoundUpSettingsUpdate = Database['public']['Tables']['roundup_settings']['Update']
