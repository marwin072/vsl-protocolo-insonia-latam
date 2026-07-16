/**
 * Hand-written types matching supabase/schema.sql. Once the Supabase project exists,
 * prefer regenerating this with `supabase gen types typescript` and replacing this file.
 */
export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          email: string;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_term: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_term?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
        Relationships: [];
      };
      purchases: {
        Row: {
          id: string;
          email: string;
          platform: string;
          product_id: string | null;
          transaction_id: string;
          amount_cents: number | null;
          currency: string;
          status: string;
          raw_payload: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          platform: string;
          product_id?: string | null;
          transaction_id: string;
          amount_cents?: number | null;
          currency?: string;
          status: string;
          raw_payload?: unknown;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['purchases']['Insert']>;
        Relationships: [];
      };
      members: {
        Row: {
          email: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          email: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['members']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
