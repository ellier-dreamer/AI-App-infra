"use client";

import { useActionState } from "react";
import { uploadFileAction } from "@/actions/upload";
import { FormError } from "@/components/auth/form-error";
import { MAX_UPLOAD_MB } from "@/lib/validations/upload";

export function UploadForm() {
  const [state, action, pending] = useActionState(uploadFileAction, undefined);

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="file" className="text-sm font-medium">
          Upload a file
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          className="text-sm text-zinc-600 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white file:disabled:opacity-50 dark:text-zinc-400 dark:file:bg-zinc-100 dark:file:text-zinc-900"
        />
        <p className="text-xs text-zinc-500">
          Stored privately in your account folder. Up to {MAX_UPLOAD_MB}MB.
        </p>
      </div>
      {state?.status === "error" && <FormError message={state.error} />}
      {state?.status === "success" && (
        <p
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
        >
          File uploaded.
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
