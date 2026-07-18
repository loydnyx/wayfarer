"use client";

import { useEffect, useState } from "react";
import { Plane, PlaneTakeoff, Info } from "lucide-react";
import { getAirportCode } from "@/lib/airports";

type Flight = {
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalTime: string;
  status: string;
};

type Props = {
  origin?: string;
  destination: string;
  flightEstimate?: string;
};

export default function FlightInfo({ origin, destination, flightEstimate }: Props) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAirportData, setHasAirportData] = useState(true);
  const [originMatched, setOriginMatched] = useState(false); // BAGO

  useEffect(() => {
    const destCode = getAirportCode(destination);

    if (!destCode) {
      setHasAirportData(false);
      setLoading(false);
      return;
    }

    const originCode = origin ? getAirportCode(origin) : null;
    setOriginMatched(!!originCode); // BAGO

    const params = new URLSearchParams({ destination: destCode });
    if (originCode) params.set("origin", originCode);

    fetch(`/api/flights?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setFlights(data.flights || []))
      .catch(() => setFlights([]))
      .finally(() => setLoading(false));
  }, [origin, destination]);

  return (
    <div className="space-y-3">
      {flightEstimate && (
        <div className="flex gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <Plane size={18} className="mt-0.5 shrink-0 text-cyan-400" />
          <div>
            <p className="text-sm font-medium text-cyan-300">Flight Estimate</p>
            <p className="mt-1 text-sm text-slate-400">{flightEstimate}</p>
          </div>
        </div>
      )}

      {hasAirportData && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <PlaneTakeoff size={16} className="text-slate-400" />
            <p className="text-sm font-medium text-white">
              {originMatched ? "Live Flight Check" : "Live Arrivals to Destination"}
            </p>
          </div>

          {loading ? (
            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-white/10" />
          ) : flights.length > 0 ? (
            <div className="mt-3 space-y-2">
              {flights.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs"
                >
                  <span className="font-medium text-slate-300">
                    {f.airline} {f.flightNumber}
                  </span>
                  <span className="text-slate-500">{f.status}</span>
                </div>
              ))}
              <p className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500">
                <Info size={11} className="mt-0.5 shrink-0" />
                {originMatched
                  ? "Shows flights currently in the air on this specific route — not a full schedule."
                  : "We couldn't match your origin to a specific airport, so this shows all flights currently arriving at the destination — not necessarily from your origin."}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              No live flights detected {originMatched ? "on this route" : "to this destination"} right now. This
              doesn't mean no flights exist — just none currently in the air.
            </p>
          )}
        </div>
      )}
    </div>
  );
}