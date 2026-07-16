"use client";

import { useState } from "react";
import { MapPin, Calendar, Wallet, Trash2, Eye, ImageIcon, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteTrip, type SavedTrip } from "@/lib/trips/get-trips";

type Props = {
  trip: SavedTrip;
  onDeleted: (id: string) => void;
};

export default function TripCard({ trip, onDeleted }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false); // BAGO

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
        coordinates: trip.coordinates,
        bestSeason: trip.best_season,
        estimatedDailyBudget: trip.estimated_daily_budget,
        heroImageQuery: trip.hero_image_query,
        galleryQueries: trip.gallery_queries,
        heroImage: trip.hero_image,
        galleryImages: trip.gallery_images,
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
    sessionStorage.setItem("atlas_trip_saved", "true");
    sessionStorage.setItem("atlas_trip_id", trip.id);
    router.push("/trip");
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-cyan-500/30 sm:rounded-2xl">
      {/* Thumbnail image */}
      <div className="relative h-20 w-full shrink-0 overflow-hidden bg-gradient-to-br from-cyan-500/10 via-slate-900 to-black sm:h-32">
        {trip.hero_image?.thumbUrl ? (
          <img
            src={trip.hero_image.thumbUrl}
            alt={trip.hero_image.alt || trip.destination}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="text-cyan-400/40" size={20} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-5">
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300 sm:px-2.5 sm:py-1 sm:text-xs">
            {trip.status}
          </span>

          {/* BAGO — tap-to-expand na title */}
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1.5 flex w-full items-start gap-1 text-left sm:mt-2"
          >
            <h3
              className={`flex-1 text-sm font-semibold text-white sm:text-lg ${expanded ? "" : "line-clamp-2"
                }`}
            >
              {trip.title}
            </h3>
            <ChevronDown
              size={14}
              className={`mt-0.5 shrink-0 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>

        {/* Meta info */}
        <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-400 sm:mt-4 sm:gap-1.5 sm:text-sm">
          <span className={`flex items-center gap-1 sm:gap-1.5 ${expanded ? "" : "truncate"}`}>
            <MapPin size={11} className="shrink-0 sm:size-[14px]" />
            <span className={expanded ? "" : "truncate"}>{trip.destination}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0 sm:gap-1.5">
            <Calendar size={11} className="shrink-0 sm:size-[14px]" />
            {trip.days} Days
          </span>
          <span className={`flex items-center gap-1 sm:gap-1.5 ${expanded ? "" : "truncate"}`}>
            <Wallet size={11} className="shrink-0 sm:size-[14px]" />
            <span className={expanded ? "" : "truncate"}>{trip.budget}</span>
          </span>
        </div>

        {/* Spacer — itinutulak ang buttons palagi sa ibaba */}
        <div className="flex-1" />

        <div className="mt-3 flex gap-2 sm:mt-5 sm:gap-3">
          <button
            onClick={handleView}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cyan-500 py-1.5 text-xs font-medium text-black transition-colors hover:bg-cyan-400 sm:rounded-xl sm:py-2.5 sm:text-sm"
          >
            <Eye size={13} className="sm:size-4" />
            View
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <Trash2 size={13} className="sm:size-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}