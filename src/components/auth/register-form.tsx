"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { FormError } from "@/components/auth/form-error";
import { MIN_PASSWORD_LENGTH } from "@/lib/validations/auth";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          autoComplete="new-password"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <p className="text-xs text-zinc-500">
          At least {MIN_PASSWORD_LENGTH} characters.
        </p>
      </div>
      <FormError message={state?.error} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
