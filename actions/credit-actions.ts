"use server";

import { getUser } from "./auth-actions";

import { Tables } from "@/database.type";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface CreditsResponse {
  error: string | null;
  success: boolean;
  data: Tables<"credits"> | null;
}

export async function getCredits(): Promise<CreditsResponse> {
  const {
    data: { user },
  } = await getUser();
  const { data: creditsData, error } = await supabaseAdmin
    .from("credits")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  if (error) {
    return {
      error: error?.message || null,
      success: false,
      data: null,
    };
  }

  return {
    data: creditsData || null,
    error: null,
    success: true,
  };
}