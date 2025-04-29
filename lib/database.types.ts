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
      addresses: {
        Row: {
          id: string
          user_id: string
          type: string
          is_default: boolean
          first_name: string
          last_name: string
          company: string | null
          address1: string
          address2: string | null
          city: string
          state: string
          zip: string
          country: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          is_default?: boolean
          first_name: string
          last_name: string
          company?: string | null
          address1: string
          address2?: string | null
          city: string
          state: string
          zip: string
          country: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          is_default?: boolean
          first_name?: string
          last_name?: string
          company?: string | null
          address1?: string
          address2?: string | null
          city?: string
          state?: string
          zip?: string
          country?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'addresses_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          logo: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cart_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cart_items_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          name: string
          price: number
          quantity: number
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          name: string
          price: number
          quantity: number
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          name?: string
          price?: number
          quantity?: number
          image?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          order_number: string
          status: string
          payment_status: string
          subtotal: number
          tax: number
          shipping: number
          total: number
          shipping_address_id: string | null
          billing_address_id: string | null
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          order_number: string
          status?: string
          payment_status?: string
          subtotal: number
          tax: number
          shipping: number
          total: number
          shipping_address_id?: string | null
          billing_address_id?: string | null
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          order_number?: string
          status?: string
          payment_status?: string
          subtotal?: number
          tax?: number
          shipping?: number
          total?: number
          shipping_address_id?: string | null
          billing_address_id?: string | null
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_billing_address_id_fkey'
            columns: ['billing_address_id']
            isOneToOne: false
            referencedRelation: 'addresses'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_shipping_address_id_fkey'
            columns: ['shipping_address_id']
            isOneToOne: false
            referencedRelation: 'addresses'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      product_categories: {
        Row: {
          product_id: string
          category_id: string
        }
        Insert: {
          product_id: string
          category_id: string
        }
        Update: {
          product_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_categories_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_categories_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string | null
          user_name: string
          rating: number
          title: string | null
          content: string | null
          helpful: number | null
          verified: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id?: string | null
          user_name: string
          rating: number
          title?: string | null
          content?: string | null
          helpful?: number | null
          verified?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string | null
          user_name?: string
          rating?: number
          title?: string | null
          content?: string | null
          helpful?: number | null
          verified?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_reviews_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_reviews_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          short_description: string | null
          price: number
          sale_price: number | null
          stock: number
          brand_id: string
          images: string[] | null
          specifications: Json | null
          featured: boolean | null
          created_at: string
          updated_at: string
          model: string | null
          year: number | null
          volume: number | null
          fuel_type: 'Бензин' | 'Дизель' | null
          body_type: 'Седан' | 'Универсал' | 'Хэтчбэк' | 'Минивэн' | 'Купе' | 'Фургон' | null
          transmission: 'Механика' | 'Автомат' | null
          currency: 'USD' | 'EUR' | 'BYN' | 'RUB' | null
          condition: 'Новое' | 'Б/У' | null
          brands: {
            name: string
          } | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          short_description?: string | null
          price: number
          sale_price?: number | null
          stock?: number
          brand_id: string
          images?: string[] | null
          specifications?: Json | null
          featured?: boolean | null
          created_at?: string
          updated_at?: string
          model?: string | null
          year?: number | null
          volume?: number | null
          fuel_type?: 'Бензин' | 'Дизель' | null
          body_type?: 'Седан' | 'Универсал' | 'Хэтчбэк' | 'Минивэн' | 'Купе' | 'Фургон' | null
          transmission?: 'Механика' | 'Автомат' | null
          currency?: 'USD' | 'EUR' | 'BYN' | 'RUB' | null
          condition?: 'Новое' | 'Б/У' | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          short_description?: string | null
          price?: number
          sale_price?: number | null
          stock?: number
          brand_id?: string
          images?: string[] | null
          specifications?: Json | null
          featured?: boolean | null
          created_at?: string
          updated_at?: string
          model?: string | null
          year?: number | null
          volume?: number | null
          fuel_type?: 'Бензин' | 'Дизель' | null
          body_type?: 'Седан' | 'Универсал' | 'Хэтчбэк' | 'Минивэн' | 'Купе' | 'Фургон' | null
          transmission?: 'Механика' | 'Автомат' | null
          currency?: 'USD' | 'EUR' | 'BYN' | 'RUB' | null
          condition?: 'Новое' | 'Б/У' | null
        }
        Relationships: [
          {
            foreignKeyName: 'products_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'brands'
            referencedColumns: ['id']
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_compatibility: {
        Row: {
          id: string
          product_id: string
          year_id: string
          trim: string | null
          engine: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          product_id: string
          year_id: string
          trim?: string | null
          engine?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          year_id?: string
          trim?: string | null
          engine?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vehicle_compatibility_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vehicle_compatibility_year_id_fkey'
            columns: ['year_id']
            isOneToOne: false
            referencedRelation: 'vehicle_years'
            referencedColumns: ['id']
          }
        ]
      }
      vehicle_makes: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      vehicle_models: {
        Row: {
          id: string
          make_id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          make_id: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          make_id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: 'vehicle_models_make_id_fkey'
            columns: ['make_id']
            isOneToOne: false
            referencedRelation: 'vehicle_makes'
            referencedColumns: ['id']
          }
        ]
      }
      vehicle_years: {
        Row: {
          id: string
          model_id: string
          year: number
        }
        Insert: {
          id?: string
          model_id: string
          year: number
        }
        Update: {
          id?: string
          model_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: 'vehicle_years_model_id_fkey'
            columns: ['model_id']
            isOneToOne: false
            referencedRelation: 'vehicle_models'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      product_rating_summary: {
        Row: {
          product_id: string | null
          review_count: number | null
          average_rating: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'product_reviews_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Functions: {}
    Enums: {}
  };
}

