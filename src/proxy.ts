import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/env";

const PUBLIC_ROUTES = new Set(["/login", "/signup"]);
const PROTECTED_PREFIXES = ["/logs", "/review", "/account"];

function isProtectedRoute(pathname: string) {
  return pathname === "/" || PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.has(pathname);
}

function copyCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          supabaseResponse = NextResponse.next({
            request,
          });

          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();

  const pathname = request.nextUrl.pathname;
  const isAuthenticated = Boolean(data?.claims?.sub);

  if (!isAuthenticated && isProtectedRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";

    const response = NextResponse.redirect(redirectUrl);
    copyCookies(supabaseResponse, response);
    return response;
  }

  if (isAuthenticated && isPublicRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/logs";
    redirectUrl.search = "";

    const response = NextResponse.redirect(redirectUrl);
    copyCookies(supabaseResponse, response);
    return response;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/recall-logs).*)",
  ],
};
