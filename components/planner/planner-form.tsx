"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { TripInput } from "@/types/trip";
import { POPULAR_DESTINATIONS } from "@/lib/destinations";

type Props = {
  onGenerate: (trip: TripInput) => void;
};

export default function PlannerForm({ onGenerate }: Props) {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions =
    destination.trim().length > 0
      ? POPULAR_DESTINATIONS.filter((d) =>
          d.toLowerCase().includes(destination.toLowerCase())
        ).slice(0, 10)
      : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!budget.trim()) {
      newErrors.budget = "Budget is required";
    } else if (!/\d/.test(budget)) {
      newErrors.budget = "Budget should include a number (e.g. $1500)";
    }

    const dayCount = parseInt(days);
    if (!days.trim() || isNaN(dayCount) || dayCount <= 0) {
      newErrors.days = "Enter a valid number of days";
    } else if (dayCount > 30) {
      newErrors.days = "Max 30 days";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onGenerate({ destination: destination.trim(), budget: budget.trim(), days: days.trim() });
  };

  const selectSuggestion = (value: string) => {
    setDestination(value);
    clearError("destination");
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative" ref={wrapperRef}>
        <label htmlFor="destination" className="mb-2 block text-sm text-slate-400">
          Destination
        </label>
        <input
          id="destination"
          name="destination"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            clearError("destination");
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Tokyo, Japan"
          autoComplete="off"
          className={`w-full rounded-xl border bg-white/5 p-3 text-white outline-none focus:border-cyan-400 ${
            errors.destination ? "border-red-500" : "border-white/10"
          }`}
        />
        {errors.destination && (
          <p className="mt-1 text-xs text-red-400">{errors.destination}</p>
        )}

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl">
            {filteredSuggestions.map((place) => (
              <button
                key={place}
                type="button"
                onClick={() => selectSuggestion(place)}
                className="block w-full px-4 py-2.5 text-left text-sm text-slate-300 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                {place}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="budget" className="mb-2 block text-sm text-slate-400">
          Budget
        </label>
        <input
          id="budget"
          name="budget"
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value);
            clearError("budget");
          }}
          placeholder="$1500"
          className={`w-full rounded-xl border bg-white/5 p-3 text-white outline-none focus:border-cyan-400 ${
            errors.budget ? "border-red-500" : "border-white/10"
          }`}
        />
        {errors.budget && (
          <p className="mt-1 text-xs text-red-400">{errors.budget}</p>
        )}
      </div>

      <div>
        <label htmlFor="days" className="mb-2 block text-sm text-slate-400">
          Days
        </label>
        <input
          id="days"
          name="days"
          value={days}
          onChange={(e) => {
            setDays(e.target.value);
            clearError("days");
          }}
          placeholder="7"
          className={`w-full rounded-xl border bg-white/5 p-3 text-white outline-none focus:border-cyan-400 ${
            errors.days ? "border-red-500" : "border-white/10"
          }`}
        />
        {errors.days && (
          <p className="mt-1 text-xs text-red-400">{errors.days}</p>
        )}
      </div>

      <Button className="w-full" onClick={handleSubmit}>
        Generate Trip
      </Button>
    </div>
  );
}