"use client";

import { Sparkles } from "lucide-react";

type Props = {
  title: string;
  destination: string;
};

export default function ResultHero({
  title,
  destination,
}: Props) {
  return (
    <section className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-cyan-300">
        <Sparkles size={16} />
        Atlas AI Generated
      </div>

      <h1 className="text-4xl font-bold text-white leading-tight">
        {title}
      </h1>

      <p className="text-slate-400 text-lg">
        Personalized itinerary for{" "}
        <span className="text-cyan-300">
          {destination}
        </span>
      </p>
    </section>
  );
}