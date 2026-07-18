"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ResultCard from "@/components/planner/result-card";
import { Button } from "@/components/ui/button";
import type { TripInput, TripResult } from "@/types/trip";
import { CURRENCIES } from "@/lib/currencies";

import { ArrowLeft, ChevronDown } from "lucide-react";

function parseBudget(budget: string) {
  const match = budget.match(/(\d+)/);
  const amount = match ? match[1] : "";
  const codeMatch = budget.match(/\b([A-Z]{3})\b/);
  const code = codeMatch ? codeMatch[1] : "PHP";
  return { amount, code };
}

export default function TripPage() {
  const router = useRouter();
  const [formInput, setFormInput] = useState<TripInput | null>(null);
  const [trip, setTrip] = useState<TripResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSavedTrip, setIsSavedTrip] = useState(false);

  const [adjustingBudget, setAdjustingBudget] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetCurrency, setBudgetCurrency] = useState("PHP");
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [regenerateCount, setRegenerateCount] = useState(0);

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
      const parsedInput: TripInput = JSON.parse(storedInput);
      setTrip(JSON.parse(storedTrip));
      setFormInput(parsedInput);
      setIsSavedTrip(savedFlag === "true");

      const { amount, code } = parseBudget(parsedInput.budget);
      setBudgetAmount(amount);
      setBudgetCurrency(code);
    }

    // FIX: hindi na natin tinatanggal ang flag dito — kailangan itong
    // manatili para tama pa rin ang isSavedTrip kahit i-refresh ang tab.
    // Ang planner-flow.tsx na ang bahalang i-clear/i-reset ito
    // bago mag-navigate papunta dito galing sa FRESH generation.

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
    if (!contentRef.current || adjustingBudget) return;

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
  }, [trip, adjustingBudget]);

  const backHref = isSavedTrip ? "/dashboard/trips" : "/";
  const backLabel = isSavedTrip ? "Back to Dashboard" : "Back to Planner";

  const handleRegenerate = async () => {
    if (!formInput || !budgetAmount.trim()) return;

    const currency = CURRENCIES.find((c) => c.code === budgetCurrency);
    const newBudget = `${currency?.symbol ?? ""}${budgetAmount.trim()} ${budgetCurrency}`;
    const newInput: TripInput = { ...formInput, budget: newBudget };

    setRegenerating(true);
    setRegenerateError("");

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInput),
      });

      const text = await res.text();
      if (!text) throw new Error("Empty response from server");

      const parsed: TripResult = JSON.parse(text);

      setTrip(parsed);
      setFormInput(newInput);
      setAdjustingBudget(false);
      setRegenerateCount((prev) => prev + 1);

      sessionStorage.setItem("atlas_trip_result", JSON.stringify(parsed));
      sessionStorage.setItem("atlas_trip_input", JSON.stringify(newInput));
      // FIX: regenerate = hindi ito "saved" trip kahit galing sa dating saved view
      sessionStorage.setItem("atlas_trip_saved", "false");
      setIsSavedTrip(false);
    } catch (err) {
      console.error(err);
      setRegenerateError("Something went wrong. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

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
        <Button onClick={() => router.push(backHref)}>Back to Planner</Button>
      </div>
    );
  }

  const appBarTitle = `${formInput.destination} — ${formInput.days} Days`;
  const selectedCurrency = CURRENCIES.find((c) => c.code === budgetCurrency);

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

          {adjustingBudget ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white">Adjust Your Budget</h2>
              <p className="mt-2 text-sm text-slate-400">
                {formInput.destination} — {formInput.days} Days
              </p>

              <div className="mt-6">
                <label className="mb-1.5 block text-xs text-slate-400">Budget</label>
                <div className="flex gap-1.5">
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setCurrencyDropdownOpen((prev) => !prev)}
                      className="flex h-full items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white transition-colors hover:border-cyan-500/30"
                    >
                      {selectedCurrency?.symbol} {budgetCurrency}
                      <ChevronDown size={12} />
                    </button>

                    {currencyDropdownOpen && (
                      <div className="custom-scrollbar absolute left-0 z-20 mt-1 max-h-48 w-36 overflow-y-auto rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setBudgetCurrency(c.code);
                              setCurrencyDropdownOpen(false);
                            }}
                            className={`block w-full px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-cyan-500/10 hover:text-cyan-300 ${
                              c.code === budgetCurrency ? "text-cyan-300" : "text-slate-300"
                            }`}
                          >
                            {c.symbol} {c.code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    inputMode="numeric"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="1500"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {regenerateError && (
                <p className="mt-3 text-xs text-red-400">{regenerateError}</p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleRegenerate}
                  disabled={regenerating || !budgetAmount.trim()}
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-cyan-400 disabled:opacity-50"
                >
                  {regenerating ? "Regenerating..." : "Regenerate Trip"}
                </button>
                <button
                  onClick={() => setAdjustingBudget(false)}
                  disabled={regenerating}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <ResultCard
              key={regenerateCount}
              destination={formInput.destination}
              origin={formInput.origin}
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
              heroImage={trip.heroImage}
              galleryImages={trip.galleryImages}
              isSavedTrip={isSavedTrip}
              budgetFeasible={trip.budgetFeasible}
              budgetNote={trip.budgetNote}
              recommendedBudget={trip.recommendedBudget}
              flightEstimate={trip.flightEstimate}
              onAdjustBudget={() => setAdjustingBudget(true)}
            />
          )}
        </div>
      </main>
    </>
  );
}