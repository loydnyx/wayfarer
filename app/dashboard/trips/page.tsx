"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { getSavedTrips, type SavedTrip } from "@/lib/trips/get-trips";
import TripCard from "@/components/dashboard/trip-card";

export default function TripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedTrips()
      .then(setTrips)
      .catch((err) => console.error("Failed to load trips:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleted = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="px-4 py-4 sm:p-6 lg:p-10">
      <h1 className="text-xl font-bold text-text sm:text-3xl">My Trips</h1>
      <p className="mt-1 text-sm text-muted sm:mt-2 sm:text-base">
        All the itineraries you've saved for future adventures.
      </p>

      {loading ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-border bg-surface sm:h-56"
            />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <MapPin size={40} className="text-slate-500 dark:text-slate-600" />
          <p className="text-muted">No saved trips yet.</p>
          <a href="/" className="text-sm text-cyan-600 hover:underline dark:text-cyan-400">
            Plan your first trip
          </a>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}