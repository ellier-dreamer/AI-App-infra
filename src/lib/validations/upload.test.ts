import { describe, expect, it } from "vitest";
import { MAX_UPLOAD_BYTES, sanitizeFileName, uploadFileSchema } from "./upload";

function makeFile(sizeInBytes: number, name = "resume.pdf") {
  return new File([new Uint8Array(sizeInBytes)], name);
}

describe("uploadFileSchema", () => {
  it("accepts a non-empty file under the size limit", () => {
    const result = uploadFileSchema.safeParse(makeFile(1024));
    expect(result.success).toBe(true);
  });

  it("rejects an empty file", () => {
    const result = uploadFileSchema.safeParse(makeFile(0));
    expect(result.success).toBe(false);
  });

  it("rejects a file over the size limit", () => {
    const result = uploadFileSchema.safeParse(makeFile(MAX_UPLOAD_BYTES + 1));
    expect(result.success).toBe(false);
  });
});

describe("sanitizeFileName", () => {
  it("keeps a normal filename unchanged", () => {
    expect(sanitizeFileName("resume.pdf")).toBe("resume.pdf");
  });

  it("replaces unsafe characters", () => {
    expect(sanitizeFileName("my resume (final)!.pdf")).toBe(
      "my_resume__final__.pdf",
    );
  });

  it("strips path traversal segments down to safe characters", () => {
    expect(sanitizeFileName("../../etc/passwd")).toBe(".._.._etc_passwd");
  });

  it("falls back to a default name when nothing safe remains", () => {
    expect(sanitizeFileName("   ")).toBe("upload");
  });
});
