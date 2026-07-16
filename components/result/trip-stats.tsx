"use client";

import {
  Wallet,
  Calendar,
  Globe,
  AlertTriangle,
  Plane,
} from "lucide-react";

type Props = {
  budget: string;
  days: string;
  country: string;
  budgetFeasible?: boolean;
  budgetNote?: string;
  flightEstimate?: string;
};

export default function TripStats({
  budget,
  days,
  country,
  budgetFeasible = true,
  budgetNote = "",
  flightEstimate = "",
}: Props) {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={<Wallet size={18} />} title="Budget" value={budget} />
        <Stat icon={<Calendar size={18} />} title="Duration" value={`${days} Days`} />
        <Stat icon={<Globe size={18} />} title="Country" value={country} />
      </div>

      {!budgetFeasible && budgetNote && (
        <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-300">
              Your budget may be tight for this trip
            </p>
            <p className="mt-1 text-sm text-slate-400">{budgetNote}</p>
          </div>
        </div>
      )}

      {flightEstimate && (
        <div className="flex gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <Plane size={18} className="mt-0.5 shrink-0 text-cyan-400" />
          <div>
            <p className="text-sm font-medium text-cyan-300">Flight Estimate</p>
            <p className="mt-1 text-sm text-slate-400">{flightEstimate}</p>
          </div>
        </div>
      )}
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