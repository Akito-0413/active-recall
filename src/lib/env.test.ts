import { afterEach, describe, expect, it } from "vitest";

const ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "ACTIVE_RECALL_API_KEY",
] as const;

const ORIGINAL_ENV = { ...process.env };

async function loadEnvModule() {
  return import("@/lib/env");
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("env helpers", () => {
  it("returns configured environment values", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key";
    process.env.SUPABASE_SECRET_KEY = "secret-key";
    process.env.ACTIVE_RECALL_API_KEY = "recall-api-key";

    const env = await loadEnvModule();

    expect(env.getSupabaseUrl()).toBe("https://example.supabase.co");
    expect(env.getSupabasePublishableKey()).toBe("publishable-key");
    expect(env.getSupabaseSecretKey()).toBe("secret-key");
    expect(env.getRecallApiKey()).toBe("recall-api-key");
  });

  it("throws MissingEnvironmentError when a value is missing", async () => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }

    const env = await loadEnvModule();

    expect(() => env.getSupabaseUrl()).toThrowError(
      "NEXT_PUBLIC_SUPABASE_URL is not configured.",
    );
  });

  it("detects missing environment errors", async () => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }

    const env = await loadEnvModule();

    let error: unknown;
    try {
      env.getRecallApiKey();
    } catch (caughtError) {
      error = caughtError;
    }

    expect(env.isMissingEnvironmentError(error)).toBe(true);
    expect(env.isMissingEnvironmentError(new Error("other"))).toBe(false);
  });
});
