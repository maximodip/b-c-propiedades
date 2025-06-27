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
      properties: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          address: string;
          type: Database["public"]["Enums"]["property_type"];
          status: Database["public"]["Enums"]["property_status"];
          bedrooms: number | null;
          bathrooms: number | null;
          area_size: number | null;
          contact_email: string;
          contact_phone: string | null;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          address: string;
          type: Database["public"]["Enums"]["property_type"];
          status?: Database["public"]["Enums"]["property_status"];
          bedrooms?: number | null;
          bathrooms?: number | null;
          area_size?: number | null;
          contact_email: string;
          contact_phone?: string | null;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          address?: string;
          type?: Database["public"]["Enums"]["property_type"];
          status?: Database["public"]["Enums"]["property_status"];
          bedrooms?: number | null;
          bathrooms?: number | null;
          area_size?: number | null;
          contact_email?: string;
          contact_phone?: string | null;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          url: string;
          storage_path: string;
          is_main: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          url: string;
          storage_path: string;
          is_main?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          url?: string;
          storage_path?: string;
          is_main?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
      property_inquiries: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_inquiries_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      property_status: "disponible" | "vendida" | "alquilada" | "reservada";
      property_type: "casa" | "departamento" | "terreno" | "local" | "oficina";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
