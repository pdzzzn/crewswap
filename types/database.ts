export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      duties: {
        Row: {
          created_at: string | null
          date: string
          id: string
          pairing: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          pairing?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          pairing?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "duties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      flight_legs: {
        Row: {
          arrival_location: string
          arrival_time: string
          created_at: string | null
          departure_location: string
          departure_time: string
          duty_id: string | null
          flight_number: string
          id: string
          is_deadhead: boolean | null
          updated_at: string | null
        }
        Insert: {
          arrival_location: string
          arrival_time: string
          created_at?: string | null
          departure_location: string
          departure_time: string
          duty_id?: string | null
          flight_number: string
          id?: string
          is_deadhead?: boolean | null
          updated_at?: string | null
        }
        Update: {
          arrival_location?: string
          arrival_time?: string
          created_at?: string | null
          departure_location?: string
          departure_time?: string
          duty_id?: string | null
          flight_number?: string
          id?: string
          is_deadhead?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flight_legs_duty_id_fkey"
            columns: ["duty_id"]
            isOneToOne: false
            referencedRelation: "duties"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          swap_request_id: string | null
          title: string
          type: Database["public"]["Enums"]["NotificationType"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          swap_request_id?: string | null
          title: string
          type: Database["public"]["Enums"]["NotificationType"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          swap_request_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["NotificationType"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_swap_request_id_fkey"
            columns: ["swap_request_id"]
            isOneToOne: false
            referencedRelation: "swap_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      swap_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          receiver_id: string | null
          response_message: string | null
          sender_duty_id: string | null
          sender_id: string | null
          status: Database["public"]["Enums"]["SwapRequestStatus"] | null
          target_duty_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string | null
          response_message?: string | null
          sender_duty_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["SwapRequestStatus"] | null
          target_duty_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string | null
          response_message?: string | null
          sender_duty_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["SwapRequestStatus"] | null
          target_duty_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swap_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_sender_duty_id_fkey"
            columns: ["sender_duty_id"]
            isOneToOne: false
            referencedRelation: "duties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swap_requests_target_duty_id_fkey"
            columns: ["target_duty_id"]
            isOneToOne: false
            referencedRelation: "duties"
            referencedColumns: ["id"]
          },
        ]
      }
      app_logs: {
        Row: {
          id: string
          created_at: string
          level: string
          area: string | null
          route: string | null
          message: string
          meta: Json | null
          user_id: string | null
          request_id: string | null
          correlation_id: string | null
          artifact_type: string | null
          artifact_path: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          level: string
          area?: string | null
          route?: string | null
          message: string
          meta?: Json | null
          user_id?: string | null
          request_id?: string | null
          correlation_id?: string | null
          artifact_type?: string | null
          artifact_path?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          level?: string
          area?: string | null
          route?: string | null
          message?: string
          meta?: Json | null
          user_id?: string | null
          request_id?: string | null
          correlation_id?: string | null
          artifact_type?: string | null
          artifact_path?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          base: Database["public"]["Enums"]["EWLBases"] | null
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          name: string
          role: Database["public"]["Enums"]["UserRole"]
          updated_at: string | null
        }
        Insert: {
          base?: Database["public"]["Enums"]["EWLBases"] | null
          created_at?: string | null
          email: string
          id: string
          is_admin?: boolean | null
          name: string
          role: Database["public"]["Enums"]["UserRole"]
          updated_at?: string | null
        }
        Update: {
          base?: Database["public"]["Enums"]["EWLBases"] | null
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          name?: string
          role?: Database["public"]["Enums"]["UserRole"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      EWLBases:
        | "PMI"
        | "ARN"
        | "PRG"
        | "SZG"
        | "VIE"
        | "WP_PMI"
        | "WP_BCN"
        | "WP_PRG"
      NotificationType:
        | "SWAP_REQUEST_RECEIVED"
        | "SWAP_REQUEST_APPROVED"
        | "SWAP_REQUEST_DENIED"
        | "SWAP_REQUEST_CANCELLED"
      SwapRequestStatus: "PENDING" | "APPROVED" | "DENIED" | "CANCELLED"
      UserRole: "CAPTAIN" | "FIRST_OFFICER" | "PURSER" | "CABIN_ATTENDANT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      EWLBases: [
        "PMI",
        "ARN",
        "PRG",
        "SZG",
        "VIE",
        "WP_PMI",
        "WP_BCN",
        "WP_PRG",
      ],
      NotificationType: [
        "SWAP_REQUEST_RECEIVED",
        "SWAP_REQUEST_APPROVED",
        "SWAP_REQUEST_DENIED",
        "SWAP_REQUEST_CANCELLED",
      ],
      SwapRequestStatus: ["PENDING", "APPROVED", "DENIED", "CANCELLED"],
      UserRole: ["CAPTAIN", "FIRST_OFFICER", "PURSER", "CABIN_ATTENDANT"],
    },
  },
} as const

