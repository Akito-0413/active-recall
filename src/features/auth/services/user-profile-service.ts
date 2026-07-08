import "server-only";

import { cache } from "react";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireCurrentUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/features/auth/types";

class UserProfileServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "database" | "not_found" = "database",
  ) {
    super(message);
    this.name = "UserProfileServiceError";
  }
}

type UserProfileRecord = {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
};

function mapUserProfile(record: UserProfileRecord): UserProfile {
  return {
    id: record.id,
    email: record.email,
    username: record.username,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function isUserProfileServiceError(
  error: unknown,
): error is UserProfileServiceError {
  return error instanceof UserProfileServiceError;
}

export const getCurrentUserProfile = cache(async () => {
  const currentUser = await requireCurrentUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (error) {
    throw new UserProfileServiceError(
      "プロフィールを取得できませんでした。",
    );
  }

  if (!data) {
    const adminClient = createAdminClient();
    const { data: inserted, error: insertError } = await adminClient
      .from("user_profiles")
      .upsert({
        id: currentUser.id,
        email: currentUser.email,
        username: currentUser.email.split("@")[0] ?? currentUser.email,
      })
      .select("*")
      .single();

    if (insertError) {
      throw new UserProfileServiceError(
        "プロフィールを取得できませんでした。",
      );
    }

    return mapUserProfile(inserted as UserProfileRecord);
  }

  return mapUserProfile(data as UserProfileRecord);
});

export async function updateCurrentUsername(username: string) {
  const currentUser = await requireCurrentUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ username })
    .eq("id", currentUser.id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new UserProfileServiceError(
      "ユーザー名を更新できませんでした。",
    );
  }

  if (!data) {
    throw new UserProfileServiceError(
      "プロフィールが見つかりませんでした。",
      "not_found",
    );
  }

  return mapUserProfile(data as UserProfileRecord);
}
