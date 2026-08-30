import { NextRequest } from "next/server";
import { checkNamedRateLimit } from "@/lib/rate-limit";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req: NextRequest) {
  // BAGO — rate limit check, IP-based
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed } = checkNamedRateLimit("images-download", ip, {
    windowMs: 60 * 1000,
    max: 40,
  });

  if (!allowed) {
    return Response.json({ ok: false }, { status: 429 });
  }

  const { downloadLocation } = await req.json();

  if (!downloadLocation) {
    return Response.json({ error: "Missing downloadLocation" }, { status: 400 });
  }

  if (!UNSPLASH_ACCESS_KEY) {
    return Response.json({ error: "Unsplash not configured" }, { status: 500 });
  }

  try {
    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Failed to trigger Unsplash download event:", err);
    return Response.json({ ok: false }, { status: 200 });
  }
}