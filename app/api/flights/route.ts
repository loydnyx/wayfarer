import { NextRequest } from "next/server";
import { checkNamedRateLimit } from "@/lib/rate-limit";

const AERODATABOX_API_KEY = process.env.AERODATABOX_API_KEY;
const AERODATABOX_HOST = "aerodatabox.p.rapidapi.com";

export async function GET(req: NextRequest) {
  // BAGO — mas mahigpit ang limit dahil mas mahal ang AeroDataBox quota
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed } = checkNamedRateLimit("flights", ip, {
    windowMs: 60 * 1000,
    max: 10,
  });

  if (!allowed) {
    return Response.json({ hasLiveData: false, flights: [] }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const originCode = searchParams.get("origin");
  const destCode = searchParams.get("destination");

  if (!destCode) {
    return Response.json({ error: "Missing destination airport code" }, { status: 400 });
  }

  if (!AERODATABOX_API_KEY) {
    return Response.json({ error: "Flight data not configured" }, { status: 500 });
  }

  try {
    const now = new Date();
    const fromTime = now.toISOString().slice(0, 16);
    const toTime = new Date(now.getTime() + 12 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);

    const response = await fetch(
      `https://${AERODATABOX_HOST}/flights/airports/iata/${destCode}/${fromTime}/${toTime}?withLeg=true&direction=Arrival&withCancelled=false&withCodeshared=false&withCargo=false&withPrivate=false`,
      {
        headers: {
          "X-RapidAPI-Key": AERODATABOX_API_KEY,
          "X-RapidAPI-Host": AERODATABOX_HOST,
        },
        next: { revalidate: 1800 },
      }
    );

    if (!response.ok) {
      throw new Error(`AeroDataBox API error: ${response.status}`);
    }

    const data = await response.json();
    const arrivals = data.arrivals || [];

    const relevantFlights = originCode
      ? arrivals.filter(
          (f: any) => f.departure?.airport?.iata === originCode
        )
      : arrivals;

    const flights = relevantFlights.slice(0, 5).map((f: any) => ({
      flightNumber: f.number,
      airline: f.airline?.name || "Unknown",
      departureAirport: f.departure?.airport?.name || f.departure?.airport?.iata,
      arrivalTime: f.arrival?.scheduledTime?.local,
      status: f.status,
    }));

    return Response.json({
      hasLiveData: flights.length > 0,
      flights,
    });
  } catch (err) {
    console.error("Flight fetch failed:", err);
    return Response.json({ hasLiveData: false, flights: [] }, { status: 200 });
  }
}