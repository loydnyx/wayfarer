"use client";

import { createClient } from "@/lib/supabase/client";

export async function exportUserData(userId: string) {
  const supabase = createClient();

  const [{ data: trips }, { data: favorites }, { data: profile }] = await Promise.all([
    supabase.from("saved_trips").select("*").eq("user_id", userId),
    supabase.from("favorite_destinations").select("*").eq("user_id", userId),
    supabase.from("profiles").select("*").eq("id", userId).single(),
  ]);

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    profile,
    trips: trips ?? [],
    favorites: favorites ?? [],
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wayfarer-data-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}