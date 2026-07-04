"use client";

import { useState } from "react";
import { Download, Share2, Check, Plane } from "lucide-react";
import type { TripResult, TripInput } from "@/types/trip";
import { exportTripToPDF } from "@/lib/export-pdf";

type Props = {
  trip: TripResult;
  input: TripInput;
};

export default function ActionButtons({ trip, input }: Props) {
  const [copied, setCopied] = useState(false);

  const handleExportPDF = () => {
    exportTripToPDF(trip, input);
  };

  const handleShare = async () => {
    const shareText = `Check out my ${input.days}-day trip to ${input.destination}, planned by Wayfarer AI!\n\n${trip.summary}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: trip.title,
          text: shareText,
        });
      } catch (err) {
        // User cancelled or share failed silently — no action needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleCheckFlights = () => {
    const query = encodeURIComponent(`Flights to ${trip.city || input.destination}`);
    window.open(`https://www.google.com/travel/flights?q=${query}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleCheckFlights}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 text-sm font-medium text-cyan-300 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-cyan-500/20 active:translate-y-0 active:scale-[0.98]"
      >
        <Plane size={18} />
        Check Available Flights to {trip.country || input.destination}
      </button>

      <section className="flex gap-4">
        <button
          onClick={handleExportPDF}
          className="flex-1 rounded-xl bg-cyan-500 py-3 text-sm font-medium text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 active:translate-y-0 active:scale-[0.98]"
        >
          <Download className="mr-2 inline" size={18} />
          Export PDF
        </button>

        <button
          onClick={handleShare}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-cyan-500/30 hover:bg-white/10 active:translate-y-0 active:scale-[0.98]"
        >
          {copied ? (
            <>
              <Check className="mr-2 inline text-green-400" size={18} />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="mr-2 inline" size={18} />
              Share
            </>
          )}
        </button>
      </section>
    </div>
  );
}