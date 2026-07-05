type RequiredEnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  | "SUPABASE_SECRET_KEY"
  | "ACTIVE_RECALL_API_KEY";

class MissingEnvironmentError extends Error {
  constructor(key: RequiredEnvKey) {
    super(`${key} is not configured.`);
    this.name = "MissingEnvironmentError";
  }
}

function readEnv(key: RequiredEnvKey) {
  const value = process.env[key];

  if (!value) {
    throw new MissingEnvironmentError(key);
  }

  return value;
}

export function getSupabaseUrl() {
  return readEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabasePublishableKey() {
  return readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

export function getSupabaseSecretKey() {
  return readEnv("SUPABASE_SECRET_KEY");
}

export function getRecallApiKey() {
  return readEnv("ACTIVE_RECALL_API_KEY");
}

export function isMissingEnvironmentError(error: unknown): error is Error {
  return error instanceof Error && error.name === "MissingEnvironmentError";
}
