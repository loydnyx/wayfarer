import { createClient } from "@/lib/supabase/server";
import { MapPin, Globe, Wallet, Sparkles, ImageIcon } from "lucide-react";
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
    <div className="px-4 py-4 sm:px-6 sm:py-8 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-text sm:text-3xl">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted sm:mt-2 sm:text-base">
            Here's a quick look at your travel planning activity.
          </p>
        </div>

        <Link
          href="/dashboard/plan"
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-cyan-400"
        >
          <Sparkles size={16} />
          Plan New Trip
        </Link>
      </div>

      {/* Stat cards — dinagdagan ng colored icon badges */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-surface p-3 sm:p-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 sm:h-9 sm:w-9">
            <MapPin size={16} className="sm:size-[18px]" />
          </div>
          <p className="mt-2.5 text-xs text-muted sm:mt-3 sm:text-sm">Trips Planned</p>
          <p className="mt-0.5 text-2xl font-bold text-text sm:text-3xl">
            {totalTrips}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-3 sm:p-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-300 sm:h-9 sm:w-9">
            <Globe size={16} className="sm:size-[18px]" />
          </div>
          <p className="mt-2.5 text-xs text-muted sm:mt-3 sm:text-sm">Countries</p>
          <p className="mt-0.5 text-2xl font-bold text-text sm:text-3xl">
            {uniqueCountries}
          </p>
        </div>

        <div className="col-span-2 rounded-2xl border border-border bg-surface p-3 sm:col-span-1 sm:p-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 sm:h-9 sm:w-9">
            <Wallet size={16} className="sm:size-[18px]" />
          </div>
          <p className="mt-2.5 text-xs text-muted sm:mt-3 sm:text-sm">Status</p>
          <p className="mt-0.5 text-2xl font-bold text-text sm:text-3xl">
            Free Plan
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text sm:text-xl">
            Recent Trips
          </h2>
          {totalTrips > 0 && (
            <Link href="/dashboard/trips" className="text-xs text-cyan-600 hover:underline dark:text-cyan-400 sm:text-sm">
              View all
            </Link>
          )}
        </div>

        {recentTrips.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-border bg-surface p-6 text-center sm:mt-6 sm:p-8">
            <p className="text-sm text-muted sm:text-base">
              You haven't planned any trips yet.
            </p>
            <Link href="/dashboard/plan" className="mt-2 inline-block text-sm text-cyan-600 hover:underline dark:text-cyan-400">
              Plan your first trip
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-3">
            {recentTrips.map((trip) => (
              <Link
                key={trip.id}
                href="/dashboard/trips"
                className="overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-cyan-500/30 sm:rounded-2xl"
              >
                {/* Thumbnail — gamit ang naka-cache na hero image */}
                <div className="relative h-20 w-full overflow-hidden bg-gradient-to-br from-cyan-500/10 via-slate-900 to-black sm:h-28">
                  {trip.hero_image?.thumbUrl ? (
                    <img
                      src={trip.hero_image.thumbUrl}
                      alt={trip.hero_image.alt || trip.destination}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="text-cyan-400/40" size={20} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                <div className="p-3 sm:p-5">
                  <span className="inline-block rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-600 dark:text-cyan-300 sm:px-2.5 sm:py-1 sm:text-xs">
                    {trip.status}
                  </span>
                  <h3 className="mt-1.5 truncate text-sm font-semibold text-text sm:mt-2 sm:text-base">
                    {trip.title}
                  </h3>
                  <p className="mt-1 truncate text-xs text-muted sm:text-sm">
                    {trip.destination} • {trip.days} Days
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}