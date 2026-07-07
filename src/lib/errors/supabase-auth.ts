import { AuthApiError } from "@supabase/supabase-js";

export type AuthErrorContext = "login" | "register";

/**
 * Maps a raw Supabase Auth error to a message safe to show in the UI.
 * Supabase deliberately keeps some errors generic (e.g. login) to avoid
 * leaking which emails are registered.
 */
export function mapSupabaseAuthError(
  error: unknown,
  context: AuthErrorContext,
): string {
  if (!(error instanceof AuthApiError)) {
    return "Something went wrong. Please try again.";
  }

  if (context === "login") {
    // Supabase returns the same "invalid_credentials" error for both a
    // wrong password and a non-existent email, by design (anti-enumeration).
    return "Invalid email or password.";
  }

  switch (error.code) {
    case "user_already_exists":
      return "An account with this email already exists. Try logging in instead.";
    case "weak_password": {
      const reasons = (
        error as unknown as { weakPassword?: { reasons?: string[] } }
      ).weakPassword?.reasons;
      return reasons?.length
        ? `Password is too weak: ${reasons.join(", ")}.`
        : "Password is too weak. Choose a stronger password.";
    }
    default:
      return error.message || "Could not create your account. Please try again.";
  }
}
