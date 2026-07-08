import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthenticatedUser = {
  id: string;
  email: string;
};

export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
});

export const requireCurrentUser = cache(async (): Promise<AuthenticatedUser> => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
});
