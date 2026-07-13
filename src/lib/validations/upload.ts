import { z } from "zod";

// Keep in sync with the storage bucket's file_size_limit (see the
// create_user_uploads_bucket migration) and next.config.ts's
// serverActions.bodySizeLimit.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_UPLOAD_MB = MAX_UPLOAD_BYTES / (1024 * 1024);

export const uploadFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "Choose a file to upload.")
  .refine(
    (file) => file.size <= MAX_UPLOAD_BYTES,
    `File must be ${MAX_UPLOAD_MB}MB or smaller.`,
  );

/** Storage object keys only allow a safe subset of characters; anything else becomes "_". */
export function sanitizeFileName(name: string): string {
  const cleaned = name.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
  return cleaned.length > 0 ? cleaned.slice(-150) : "upload";
}
