"use client";

import { createClient } from "@/lib/supabase/client";
import type { UnsplashImage } from "@/types/trip";

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
  coordinates?: { lat: number; lng: number } | null;
  best_season?: string;
  estimated_daily_budget?: string;
  hero_image_query?: string;
  gallery_queries?: string[];
  hero_image?: UnsplashImage | null; // BAGO
  gallery_images?: (UnsplashImage | null)[]; // BAGO
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