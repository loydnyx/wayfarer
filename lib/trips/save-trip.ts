"use client";

import { createClient } from "@/lib/supabase/client";
import type { TripResult, TripInput } from "@/types/trip";
import { getOrFetchImage } from "@/lib/trips/image-cache"; // BAGO

export async function saveTrip(trip: TripResult, input: TripInput) {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    throw new Error("You must be signed in to save a trip.");
  }

  // BAGO — dumadaan na sa shared cache imbes na direktang tumawag sa /api/images
  const fallback = input.destination;

  const [heroImage, ...galleryImages] = await Promise.all([
    trip.heroImageQuery
      ? getOrFetchImage(trip.heroImageQuery, fallback, 0)
      : Promise.resolve(null),
    ...(trip.galleryQueries || []).map((q, i) =>
      getOrFetchImage(q, fallback, i + 1)
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
      hero_image: heroImage,
      gallery_images: galleryImages,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}