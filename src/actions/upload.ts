"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sanitizeFileName, uploadFileSchema } from "@/lib/validations/upload";

export type UploadActionState =
  | { status: "error"; error: string }
  | { status: "success" }
  | undefined;

export async function uploadFileAction(
  _prevState: UploadActionState,
  formData: FormData,
): Promise<UploadActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", error: "You must be logged in to upload a file." };
  }

  const fileEntry = formData.get("file");
  if (!(fileEntry instanceof File) || fileEntry.size === 0) {
    return { status: "error", error: "Choose a file to upload." };
  }

  const validated = uploadFileSchema.safeParse(fileEntry);
  if (!validated.success) {
    return { status: "error", error: validated.error.issues[0].message };
  }

  // Uploaded to "<user id>/<filename>" — storage RLS policies (see the
  // create_user_uploads_bucket migration) restrict each user to their own
  // folder, enforced independently of this check.
  const { error } = await supabase.storage
    .from("user-uploads")
    .upload(`${user.id}/${sanitizeFileName(fileEntry.name)}`, fileEntry, {
      upsert: true,
    });

  if (error) {
    return { status: "error", error: "Could not upload the file. Please try again." };
  }

  revalidatePath("/dashboard");
  return { status: "success" };
}
