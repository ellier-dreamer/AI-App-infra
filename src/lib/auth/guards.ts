import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Call from a protected page component (not a shared layout — layouts don't
 * re-run on every client-side navigation, see Next.js's Partial Rendering
 * docs, so the check needs to live where it will actually re-run).
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/** Call from login/register pages to bounce an already-authenticated user. */
export async function redirectIfAuthenticated() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }
}
