export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          story_id: string;
          title: string;
          type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          story_id: string;
          title: string;
          type: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          story_id?: string;
          title?: string;
          type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          timestamp: number;
          metadata: Json | null;
        };
        Insert: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          timestamp: number;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: string;
          content?: string;
          timestamp?: number;
          metadata?: Json | null;
        };
      };
    };
  };
}
