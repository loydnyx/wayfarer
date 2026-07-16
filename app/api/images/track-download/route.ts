import { NextRequest } from "next/server";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req: NextRequest) {
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