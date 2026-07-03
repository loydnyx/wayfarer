"use client";

import {
  Wallet,
  Calendar,
  Globe,
} from "lucide-react";

type Props = {
  budget: string;
  days: string;
  country: string;
};

export default function TripStats({
  budget,
  days,
  country,
}: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-3">

      <Stat
        icon={<Wallet size={18} />}
        title="Budget"
        value={budget}
      />

      <Stat
        icon={<Calendar size={18} />}
        title="Duration"
        value={`${days} Days`}
      />

      <Stat
        icon={<Globe size={18} />}
        title="Country"
        value={country}
      />

    </section>
  );
}

function Stat({
  icon,
  title,
  value,
}: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-2 flex items-center gap-2 text-cyan-300">
        {icon}
      </div>

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <h3 className="mt-1 text-xl font-semibold text-white">
        {value}
      </h3>
    </div>
  );
}