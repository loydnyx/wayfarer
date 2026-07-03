import { NextResponse } from "next/server";

const BASE_CURRENCY = "PHP";

// Cache rates in memory for 1 hour to avoid hitting the API on every request
let cachedRates: Record<string, number> | null = null;
let cachedAt = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET() {
  const now = Date.now();

  if (cachedRates && now - cachedAt < CACHE_DURATION) {
    return NextResponse.json({ rates: cachedRates, cached: true });
  }

  try {
    const apiKey = process.env.FASTFOREX_API_KEY;

    if (!apiKey) {
      throw new Error("Missing FASTFOREX_API_KEY");
    }

    const res = await fetch(
      `https://api.fastforex.io/fetch-all?from=${BASE_CURRENCY}&api_key=${apiKey}`
    );

    if (!res.ok) {
      throw new Error(`FastForex API error: ${res.status}`);
    }

    const data = await res.json();

    cachedRates = data.results;
    cachedAt = now;

    return NextResponse.json({ rates: cachedRates, cached: false });
  } catch (err) {
    console.error("[exchange-rates] Failed to fetch live rates:", err);

    // Fallback to hardcoded approximate rates if API fails
    const fallbackRates = {
      PHP: 1,
      USD: 0.017,
      EUR: 0.016,
      GBP: 0.014,
      JPY: 2.6,
      KRW: 23.5,
      SGD: 0.023,
      AUD: 0.026,
      CAD: 0.023,
      INR: 1.43,
      AED: 0.062,
      HKD: 0.13,
    };

    return NextResponse.json({ rates: fallbackRates, cached: false, fallback: true });
  }
}