"use client";

import { useState } from "react";
import { MapPin, Calendar, Wallet, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteTrip, type SavedTrip } from "@/lib/trips/get-trips";

type Props = {
  trip: SavedTrip;
  onDeleted: (id: string) => void;
};

export default function TripCard({ trip, onDeleted }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this trip? This cannot be undone.")) return;

    setDeleting(true);
    try {
      await deleteTrip(trip.id);
      onDeleted(trip.id);
    } catch (err) {
      console.error("Failed to delete trip:", err);
      setDeleting(false);
    }
  };

  const handleView = () => {
    sessionStorage.setItem(
      "atlas_trip_result",
      JSON.stringify({
        title: trip.title,
        summary: trip.summary,
        country: trip.country,
        city: trip.city,
        itinerary: trip.itinerary,
        tips: trip.tips,
      })
    );
    sessionStorage.setItem(
      "atlas_trip_input",
      JSON.stringify({
        destination: trip.destination,
        budget: trip.budget,
        days: trip.days,
      })
    );
    router.push("/trip");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-cyan-500/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-block rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
            {trip.status}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-white">{trip.title}</h3>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} />
          {trip.destination}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {trip.days} Days
        </span>
        <span className="flex items-center gap-1.5">
          <Wallet size={14} />
          {trip.budget}
        </span>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={handleView}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-sm font-medium text-black transition-colors hover:bg-cyan-400"
        >
          <Eye size={16} />
          View
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}