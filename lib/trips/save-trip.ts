"use client";

import { createClient } from "@/lib/supabase/client";
import type { TripResult, TripInput } from "@/types/trip";

export async function saveTrip(trip: TripResult, input: TripInput) {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    throw new Error("You must be signed in to save a trip.");
  }

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
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}