"use client";

import { createClient } from "@/lib/supabase/client";

type UnsplashImage = {
  id?: string;
  url: string;
  thumbUrl: string;
  alt: string;
  credit: string;
  creditLink: string;
  downloadLocation?: string | null;
};

function normalizeKey(query: string): string {
  return query.trim().toLowerCase();
}

async function getCachedImage(query: string): Promise<UnsplashImage | null> {
  const supabase = createClient();
  const key = normalizeKey(query);

  const { data } = await supabase
    .from("destination_images")
    .select("hero_image")
    .eq("destination_key", key)
    .single();

  return (data?.hero_image as UnsplashImage) ?? null;
}

async function cacheImage(query: string, image: UnsplashImage) {
  const supabase = createClient();
  const key = normalizeKey(query);

  await supabase.from("destination_images").upsert(
    {
      destination_key: key,
      destination_name: query,
      hero_image: image,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "destination_key" }
  );
}

// BAGO — generic function: gumagana para sa hero image AT gallery queries.
// query = ang exact search term (destination name, o AI-generated query text)
// fallback = mas broad na term kung walang mahanap sa exact query
// offset = index para sa fallback photo selection (para hindi paulit-ulit)
export async function getOrFetchImage(
  query: string,
  fallback: string,
  offset: number = 0
): Promise<UnsplashImage | null> {
  const cached = await getCachedImage(query);
  if (cached) return cached;

  try {
    const res = await fetch(
      `/api/images?query=${encodeURIComponent(query)}&count=1&fallback=${encodeURIComponent(
        fallback
      )}&offset=${offset}`
    );
    const data = await res.json();
    const image = data.images?.[0] ?? null;

    if (image) {
      cacheImage(query, image).catch((err) =>
        console.error("Failed to cache image:", err)
      );
    }

    return image;
  } catch {
    return null;
  }
}

// Panatilihin ang lumang pangalan bilang alias para sa Favorites (hero-only, walang offset)
export async function getOrFetchDestinationImage(
  destination: string
): Promise<UnsplashImage | null> {
  const parts = destination.split(",").map((p) => p.trim());
  const fallback = parts[parts.length - 1] || destination;
  return getOrFetchImage(destination, fallback, 0);
}