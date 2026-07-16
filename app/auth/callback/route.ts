import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// BAGO — whitelist ng valid internal paths, laban sa open redirect
function getSafeRedirectPath(next: string | null): string {
  if (!next) return "/";
  // Dapat magsimula sa "/" at hindi "//" (para masigurong internal path lang, hindi external URL)
  if (next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // BAGO — huwag i-log ang buong error object (puwedeng may sensitive details)
    console.error("[auth/callback] Session exchange failed");
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}