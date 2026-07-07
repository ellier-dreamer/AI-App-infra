"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapSupabaseAuthError } from "@/lib/errors/supabase-auth";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export type AuthActionState = { error: string } | undefined;

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validated = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return { error: mapSupabaseAuthError(error, "register") };
  }

  redirect("/dashboard");
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return { error: mapSupabaseAuthError(error, "login") };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
