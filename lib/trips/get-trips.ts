"use client";

import { createClient } from "@/lib/supabase/client";

export type SavedTrip = {
  id: string;
  title: string;
  destination: string;
  budget: string;
  days: string;
  summary: string;
  country: string;
  city: string;
  itinerary: string[];
  tips: string[];
  status: string;
  created_at: string;
};

export async function getSavedTrips(): Promise<SavedTrip[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("saved_trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function deleteTrip(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("saved_trips").delete().eq("id", id);

  if (error) throw error;
}