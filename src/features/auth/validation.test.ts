import { describe, expect, it } from "vitest";

import {
  getDefaultUsernameFromEmail,
  signInSchema,
  updateProfileSchema,
} from "@/features/auth/validation";

describe("auth validation", () => {
  it("accepts valid sign in input", () => {
    const result = signInSchema.safeParse({
      email: " Reader@example.com ",
      password: "password123",
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error("Expected schema parsing to succeed");
    }

    expect(result.data.email).toBe("reader@example.com");
  });

  it("rejects short passwords", () => {
    const result = signInSchema.safeParse({
      email: "reader@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
  });

  it("extracts the default username from the email local part", () => {
    expect(getDefaultUsernameFromEmail("Reader.Name@example.com")).toBe(
      "reader.name",
    );
  });

  it("rejects blank usernames", () => {
    const result = updateProfileSchema.safeParse({
      username: "   ",
    });

    expect(result.success).toBe(false);
  });
});
