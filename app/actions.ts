"use server";

import { revalidatePath } from "next/cache";
import { CATEGORIES, getSupabase } from "@/lib/supabase";

export type FormState = { ok: boolean; message: string } | null;

export async function addDish(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const dish = String(formData.get("dish") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const guests = Number(formData.get("guests") ?? 1);
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name || !dish) return { ok: false, message: "Please add your name and your dish." };
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { ok: false, message: "Please pick a category." };
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return { ok: false, message: "Party size should be between 1 and 20." };
  }

  const { error } = await getSupabase().from("dishes").insert({ name, dish, category, guests, notes });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: `Someone's already bringing "${dish}" — pick something different!` };
    }
    console.error(error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  revalidatePath("/");
  return { ok: true, message: `Thank you, ${name}! ${dish} is on the menu.` };
}
