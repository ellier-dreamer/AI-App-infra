import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth";

describe("registerSchema", () => {
  it("accepts a valid email and password", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "longenough",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      password: "longenough",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty email", () => {
    const result = registerSchema.safeParse({
      email: "",
      password: "longenough",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than the minimum length", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace around the email", () => {
    const result = registerSchema.safeParse({
      email: "  user@example.com  ",
      password: "longenough",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });
});

describe("loginSchema", () => {
  it("accepts any non-empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "x",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "x",
    });
    expect(result.success).toBe(false);
  });
});
