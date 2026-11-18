import { createClient } from "@supabase/supabase-js";

export type Dish = {
  id: string;
  created_at: string;
  name: string;
  dish: string;
  category: string;
  guests: number;
  notes: string | null;
};

export const CATEGORIES = ["Appetizer", "Main", "Side", "Dessert", "Drinks", "Other"] as const;

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
