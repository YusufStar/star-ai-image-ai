"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

interface AuthResponse {
  error: null | string;
  success: boolean;
  data: unknown | null;
}

export async function signup(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    options: {
      data: {
        full_name: String(formData.get("full_name")),
      },
    },
  };

  const { data: signupData, error } = await supabase.auth.signUp(data);

  return {
    error: error?.message || "There was an error signing up!",
    success: !error,
    data: signupData || null,
  };
}

export async function login(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  };

  const { data: loginData, error } =
    await supabase.auth.signInWithPassword(data);

  return {
    error: error?.message || "There was an error logging up!",
    success: !error,
    data: loginData || null,
  };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();

  await supabase.auth.signOut();
  redirect("/login?mode=login");
}

export async function getUser() {
  const supabase = await createClient();

  return supabase.auth.getUser();
}

export async function updateUser(values: { fullName: string }) {
  const supabase = await createClient();
  const full_name = values.fullName;

  const { data: signInData, error: signInError } =
    await supabase.auth.updateUser({
      data: {
        full_name,
      },
    });

  return {
    error: signInError?.message || "There was an error updating the user!",
    success: !signInError,
    data: signInData || null,
  };
}

export async function updatePassword() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  try {
    const { data: updatePasswordData, error: updatePasswordError } =
      await supabase.auth.resetPasswordForEmail(user?.email!);

    return {
      error:
        updatePasswordError?.message ||
        "There was an error updating the password!",
      success: !updatePasswordError,
      data: updatePasswordData || null,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "There was an error updating the password!",
      success: false,
      data: null,
    };
  }
}
