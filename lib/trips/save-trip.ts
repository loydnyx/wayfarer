"use client";

import { createClient } from "@/lib/supabase/client";
import type { TripResult, TripInput, UnsplashImage } from "@/types/trip";

async function fetchImage(
  query: string,
  fallback: string,
  offset: number
): Promise<UnsplashImage | null> {
  try {
    const res = await fetch(
      `/api/images?query=${encodeURIComponent(query)}&count=1&fallback=${encodeURIComponent(
        fallback
      )}&offset=${offset}`
    );
    const data = await res.json();
    return data.images?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function saveTrip(trip: TripResult, input: TripInput) {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    throw new Error("You must be signed in to save a trip.");
  }

  // BAGO — kunin ang aktwal na image data isang beses, dito lang sa oras ng Save
  const [heroImage, ...galleryImages] = await Promise.all([
    trip.heroImageQuery
      ? fetchImage(trip.heroImageQuery, input.destination, 0)
      : Promise.resolve(null),
    ...(trip.galleryQueries || []).map((q, i) =>
      fetchImage(q, input.destination, i + 1)
    ),
  ]);

  const { data, error } = await supabase
    .from("saved_trips")
    .insert({
      user_id: user.id,
      title: trip.title,
      destination: input.destination,
      budget: input.budget,
      days: input.days,
      summary: trip.summary,
      country: trip.country,
      city: trip.city,
      itinerary: trip.itinerary,
      tips: trip.tips,
      status: "planned",
      coordinates: trip.coordinates,
      best_season: trip.bestSeason,
      estimated_daily_budget: trip.estimatedDailyBudget,
      hero_image_query: trip.heroImageQuery,
      gallery_queries: trip.galleryQueries,
      hero_image: heroImage, // BAGO
      gallery_images: galleryImages, // BAGO
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}