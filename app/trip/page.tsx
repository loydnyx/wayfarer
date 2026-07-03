"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ResultCard from "@/components/planner/result-card";
import { Button } from "@/components/ui/button";
import type { TripInput, TripResult } from "@/types/trip";


import { ArrowLeft } from "lucide-react";

export default function TripPage() {
  const router = useRouter();
  const [formInput, setFormInput] = useState<TripInput | null>(null);
  const [trip, setTrip] = useState<TripResult | null>(null);
  const [loading, setLoading] = useState(true);

  const contentRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  useEffect(() => {
    const storedTrip = sessionStorage.getItem("atlas_trip_result");
    const storedInput = sessionStorage.getItem("atlas_trip_input");

    if (storedTrip && storedInput) {
      setTrip(JSON.parse(storedTrip));
      setFormInput(JSON.parse(storedInput));
    }

    setLoading(false);
  }, []);

  // Detect if the user manually scrolls up — if so, stop auto-scrolling
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 150;
      userScrolledUpRef.current = !nearBottom;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll to bottom as content grows, unless the user scrolled up
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!userScrolledUpRef.current) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [trip]);

  if (loading) {
    return (
      <main className="relative min-h-screen bg-[#050816] px-6 py-16">
        <div className="mx-auto max-w-3xl animate-pulse space-y-10">
          <div className="h-8 w-40 rounded-full bg-white/5" />

          <div className="space-y-3">
            <div className="h-6 w-48 rounded-full bg-white/5" />
            <div className="h-10 w-2/3 rounded-lg bg-white/5" />
            <div className="h-5 w-1/2 rounded-lg bg-white/5" />
          </div>

          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-3/4 rounded bg-white/10" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 rounded-2xl bg-white/5" />
            <div className="h-20 rounded-2xl bg-white/5" />
            <div className="h-20 rounded-2xl bg-white/5" />
          </div>
        </div>
      </main>
    );
  }

  if (!trip || !formInput) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-slate-400">No trip found. Generate one first.</p>
        <Button onClick={() => router.push("/")}>Back to Planner</Button>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#050816] px-6 py-16">
      <div className="mx-auto max-w-3xl" ref={contentRef}>
        <button
          onClick={() => router.push("/")}
          className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Planner
        </button>

        <ResultCard
          destination={formInput.destination}
          budget={formInput.budget}
          days={formInput.days}
          title={trip.title}
          summary={trip.summary}
          itinerary={trip.itinerary}
          tips={trip.tips}
          country={trip.country}
          city={trip.city}
          coordinates={trip.coordinates}
          bestSeason={trip.bestSeason}
          estimatedDailyBudget={trip.estimatedDailyBudget}
          heroImageQuery={trip.heroImageQuery}
          galleryQueries={trip.galleryQueries}
        />
      </div>
    </main>
  );
}