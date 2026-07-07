"use client";

import { createClient } from "@/lib/supabase/client";

export async function signInWithGoogle(next: string = "/dashboard") {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
}