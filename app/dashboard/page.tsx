import { createClient } from "@/lib/supabase/server";
import { MapPin, Globe, Wallet } from "lucide-react";
import Link from "next/link";

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  const { data: trips } = await supabase
    .from("saved_trips")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const totalTrips = trips?.length ?? 0;
  const uniqueCountries = new Set(trips?.map((t) => t.country).filter(Boolean)).size;
  const recentTrips = trips?.slice(0, 3) ?? [];

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-white">Welcome back, {firstName} 👋</h1>
      <p className="mt-2 text-slate-400">
        Here's a quick look at your travel planning activity.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={16} />
            <span className="text-sm">Trips Planned</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{totalTrips}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <Globe size={16} />
            <span className="text-sm">Countries</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{uniqueCountries}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-slate-400">
            <Wallet size={16} />
            <span className="text-sm">Status</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">Free Plan</p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Trips</h2>
          {totalTrips > 0 && (
            <Link href="/dashboard/trips" className="text-sm text-cyan-400 hover:underline">
              View all
            </Link>
          )}
        </div>

        {recentTrips.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-slate-400">You haven't planned any trips yet.</p>
            <Link href="/" className="mt-2 inline-block text-sm text-cyan-400 hover:underline">
              Plan your first trip
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentTrips.map((trip) => (
              <Link
                key={trip.id}
                href="/dashboard/trips"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-cyan-500/30"
              >
                <span className="inline-block rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                  {trip.status}
                </span>
                <h3 className="mt-2 font-semibold text-white">{trip.title}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {trip.destination} • {trip.days} Days
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}