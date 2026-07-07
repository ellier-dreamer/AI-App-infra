import { z } from "zod";

// Keep in sync with the Supabase dashboard setting: Auth -> Providers -> Email
// -> Minimum password length (set to 8 there as part of setup).
export const MIN_PASSWORD_LENGTH = 8;

export const registerSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    ),
});

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
