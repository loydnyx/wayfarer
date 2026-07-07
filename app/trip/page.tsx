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
  const [isSavedTrip, setIsSavedTrip] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const storedTrip = sessionStorage.getItem("atlas_trip_result");
    const storedInput = sessionStorage.getItem("atlas_trip_input");
    const savedFlag = sessionStorage.getItem("atlas_trip_saved");

    if (storedTrip && storedInput) {
      setTrip(JSON.parse(storedTrip));
      setFormInput(JSON.parse(storedInput));
      setIsSavedTrip(savedFlag === "true");
    }

    sessionStorage.removeItem("atlas_trip_saved");

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 150;
      userScrolledUpRef.current = !nearBottom;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // BAGO — dynamic route + label depende sa context
  const backHref = isSavedTrip ? "/dashboard/trips" : "/";
  const backLabel = isSavedTrip ? "Return" : "Back to Planner";

  if (loading) {
    return (
      <main className="relative min-h-screen bg-[#050816] px-4 py-6 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6 sm:space-y-10">
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

  const appBarTitle = `${formInput.destination} — ${formInput.days} Days`;

  return (
    <>
      {/* Sticky mobile app-bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center gap-3 border-b border-white/10 bg-[#050816]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <button
          onClick={() => router.push(backHref)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <p className="flex-1 truncate text-center text-sm font-medium text-white">
          {appBarTitle}
        </p>
        <div className="w-8 shrink-0" />
      </div>

      <main className="relative min-h-screen bg-[#050816] px-4 pb-6 pt-16 sm:px-6 sm:py-16 lg:pt-16">
        <div className="mx-auto max-w-3xl" ref={contentRef}>
          {/* Desktop-only back link */}
          <button
            onClick={() => router.push(backHref)}
            className="group mb-10 hidden items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300 lg:inline-flex"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            {backLabel}
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
            isSavedTrip={isSavedTrip}
          />
        </div>
      </main>
    </>
  );
}