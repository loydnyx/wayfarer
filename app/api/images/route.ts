import { NextRequest } from "next/server";
import { checkNamedRateLimit } from "@/lib/rate-limit";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function searchUnsplash(query: string, perPage: number) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=${perPage}&orientation=landscape`,
    {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`);

  const data = await response.json();
  return data.results || [];
}

export async function GET(req: NextRequest) {
  // BAGO — rate limit check, IP-based
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed } = checkNamedRateLimit("images", ip, {
    windowMs: 60 * 1000, // 1 minute
    max: 40, // mataas dahil maraming calls kada trip generation (hero + gallery)
  });

  if (!allowed) {
    return Response.json({ images: [] }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const fallbackQuery = searchParams.get("fallback");
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (!query) {
    return Response.json({ error: "Missing query parameter" }, { status: 400 });
  }

  if (!UNSPLASH_ACCESS_KEY) {
    return Response.json({ error: "Unsplash not configured" }, { status: 500 });
  }

  try {
    let results = await searchUnsplash(query, 1);

    if (results.length === 0 && fallbackQuery) {
      const fallbackResults = await searchUnsplash(fallbackQuery, 10);
      const picked = fallbackResults[offset % fallbackResults.length];
      results = picked ? [picked] : [];
    }

    const images = results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.small,
      alt: photo.alt_description || query,
      credit: photo.user?.name || "Unsplash",
      creditLink: photo.user?.links?.html || "https://unsplash.com",
      downloadLocation: photo.links?.download_location || null,
    }));

    return Response.json({ images });
  } catch (err) {
    console.error("Image fetch failed:", err);
    return Response.json({ images: [] }, { status: 200 });
  }
}