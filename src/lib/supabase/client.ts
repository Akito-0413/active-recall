import { createBrowserClient } from "@supabase/ssr";

import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/env";

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
  );
}
