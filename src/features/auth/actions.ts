"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  AuthActionState,
  ProfileActionState,
} from "@/features/auth/types";
import {
  isUserProfileServiceError,
  updateCurrentUsername,
} from "@/features/auth/services/user-profile-service";
import {
  signInSchema,
  signUpSchema,
  updateProfileSchema,
} from "@/features/auth/validation";
import { isMissingEnvironmentError } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function buildOrigin(forwardedHost: string | null, forwardedProto: string | null) {
  if (!forwardedHost) {
    return "http://127.0.0.1:3000";
  }

  return `${forwardedProto ?? "https"}://${forwardedHost}`;
}

async function getAuthRedirectUrl() {
  const requestHeaders = await headers();

  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const host = requestHeaders.get("host");

  return `${buildOrigin(forwardedHost ?? host, forwardedProto)}${"/auth/callback"}`;
}

function buildAuthErrorState(
  message: string,
  fieldErrors?: AuthActionState["fieldErrors"],
): AuthActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function buildProfileErrorState(
  message: string,
  fieldErrors?: ProfileActionState["fieldErrors"],
): ProfileActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function getAuthErrorMessage(error: unknown) {
  if (isMissingEnvironmentError(error)) {
    return "環境変数が不足しているため、認証を利用できません。";
  }

  return "認証に失敗しました。時間をおいて再度お試しください。";
}

async function hasExistingUserProfileByEmail(email: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export async function signUpWithEmailAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return buildAuthErrorState(
      "入力内容を確認してください。",
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const exists = await hasExistingUserProfileByEmail(parsed.data.email);

    if (exists) {
      return buildAuthErrorState(
        "このメールアドレスはすでに利用されています。ログインするか、Googleで続けてください。",
        {
          email: ["このメールアドレスはすでに利用されています。"],
        },
      );
    }
  } catch (error) {
    return buildAuthErrorState(getAuthErrorMessage(error));
  }

  let signUpError: string | null = null;
  let hasSession = false;

  try {
    const supabase = await createServerSupabaseClient();
    const redirectTo = await getAuthRedirectUrl();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    signUpError = error?.message ?? null;
    hasSession = Boolean(data.session);
  } catch (error) {
    return buildAuthErrorState(getAuthErrorMessage(error));
  }

  if (signUpError) {
    return buildAuthErrorState(signUpError);
  }

  if (hasSession) {
    redirect("/logs");
  }

  redirect("/login?message=signup-success");
}

export async function signInWithEmailAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return buildAuthErrorState(
      "入力内容を確認してください。",
      parsed.error.flatten().fieldErrors,
    );
  }

  let signInError = false;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    signInError = Boolean(error);
  } catch (error) {
    return buildAuthErrorState(getAuthErrorMessage(error));
  }

  if (signInError) {
    return buildAuthErrorState("メールアドレスまたはパスワードが正しくありません。");
  }

  redirect("/logs");
}

export async function signInWithGoogleAction() {
  const supabase = await createServerSupabaseClient();
  const redirectTo = await getAuthRedirectUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = updateProfileSchema.safeParse({
    username: formData.get("username"),
  });

  if (!parsed.success) {
    return buildProfileErrorState(
      "入力内容を確認してください。",
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    await updateCurrentUsername(parsed.data.username);
    revalidatePath("/account");

    return {
      status: "success",
      message: "プロフィールを更新しました。",
    };
  } catch (error) {
    if (isUserProfileServiceError(error)) {
      return buildProfileErrorState(error.message);
    }

    return buildProfileErrorState(
      isMissingEnvironmentError(error)
        ? "環境変数が不足しているため、プロフィールを更新できません。"
        : "プロフィールの更新に失敗しました。",
    );
  }
}
