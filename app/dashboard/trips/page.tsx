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
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-white">My Trips</h1>
      <p className="mt-2 text-slate-400">
        All the itineraries you've saved for future adventures.
      </p>

      {loading ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <MapPin size={40} className="text-slate-600" />
          <p className="text-slate-400">No saved trips yet.</p>
          <a href="/" className="text-sm text-cyan-400 hover:underline">
            Plan your first trip
          </a>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}