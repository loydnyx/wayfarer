"use client";

import { Wallet, Calendar, Globe, Sun } from "lucide-react";
import FlightInfo from "./flight-info";

type Props = {
  budget: string;
  days: string;
  country: string;
  destination: string;
  origin?: string;
  bestSeason?: string;
  budgetFeasible?: boolean;
  budgetNote?: string;
  flightEstimate?: string;
};

export default function TripStats({
  budget,
  days,
  country,
  destination,
  origin,
  bestSeason = "",
  flightEstimate = "",
}: Props) {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={<Wallet size={18} />} title="Budget" value={budget} />
        <Stat icon={<Calendar size={18} />} title="Duration" value={`${days} Days`} />
        <Stat icon={<Globe size={18} />} title="Country" value={country} />
      </div>

      {bestSeason && (
        <div className="flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <Sun size={18} className="mt-0.5 shrink-0 text-amber-300" />
          <div>
            <p className="text-sm font-medium text-amber-300">Best Season to Visit</p>
            <p className="mt-1 text-sm text-slate-400">{bestSeason}</p>
          </div>
        </div>
      )}

      <FlightInfo origin={origin} destination={destination} flightEstimate={flightEstimate} />
    </section>
  );
}

function Stat({ icon, title, value }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-2 flex items-center gap-2 text-cyan-300">{icon}</div>
      <p className="text-xs text-slate-500">{title}</p>
      <h3 className="mt-1 text-xl font-semibold text-white">{value}</h3>
    </div>
  );
}