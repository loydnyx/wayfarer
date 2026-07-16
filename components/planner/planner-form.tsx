"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripInput } from "@/types/trip";
import { POPULAR_DESTINATIONS } from "@/lib/destinations";
import { CURRENCIES } from "@/lib/currencies";
import { useUserCurrency } from "@/hooks/use-user-currency";

type Props = {
  onGenerate: (trip: TripInput) => void;
};

export default function PlannerForm({ onGenerate }: Props) {
  const { currencyCode: preferredCurrency } = useUserCurrency();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetCurrency, setBudgetCurrency] = useState("PHP");
  const [days, setDays] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBudgetCurrency(preferredCurrency);
  }, [preferredCurrency]);

  const filteredOriginSuggestions =
    origin.trim().length > 0
      ? POPULAR_DESTINATIONS.filter((d) =>
          d.toLowerCase().includes(origin.toLowerCase())
        ).slice(0, 10)
      : [];

  const filteredDestSuggestions =
    destination.trim().length > 0
      ? POPULAR_DESTINATIONS.filter((d) =>
          d.toLowerCase().includes(destination.toLowerCase())
        ).slice(0, 10)
      : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestSuggestions(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
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

    if (!budgetAmount.trim()) {
      newErrors.budget = "Budget is required";
    } else if (!/^\d+$/.test(budgetAmount.trim())) {
      newErrors.budget = "Enter a valid number";
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

    const currency = CURRENCIES.find((c) => c.code === budgetCurrency);
    const formattedBudget = `${currency?.symbol ?? ""}${budgetAmount.trim()} ${budgetCurrency}`;

    onGenerate({
      destination: destination.trim(),
      origin: origin.trim() || undefined,
      budget: formattedBudget,
      days: days.trim(),
    });
  };

  const selectOriginSuggestion = (value: string) => {
    setOrigin(value);
    setShowOriginSuggestions(false);
  };

  const selectDestSuggestion = (value: string) => {
    setDestination(value);
    clearError("destination");
    setShowDestSuggestions(false);
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === budgetCurrency);

  return (
    <div className="space-y-3">
      {/* Flying From (optional) */}
      <div className="relative" ref={originRef}>
        <label htmlFor="origin" className="mb-1.5 block text-xs text-slate-400">
          Country From <span className="text-slate-600">(optional)</span>
        </label>
        <input
          id="origin"
          name="origin"
          value={origin}
          onChange={(e) => {
            setOrigin(e.target.value);
            setShowOriginSuggestions(true);
          }}
          onFocus={() => setShowOriginSuggestions(true)}
          placeholder="Manila, Philippines"
          autoComplete="off"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
        />

        {showOriginSuggestions && filteredOriginSuggestions.length > 0 && (
          <div className="custom-scrollbar absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl">
            {filteredOriginSuggestions.map((place) => (
              <button
                key={place}
                type="button"
                onClick={() => selectOriginSuggestion(place)}
                className="block w-full px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                {place}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Destination */}
      <div className="relative" ref={destRef}>
        <label htmlFor="destination" className="mb-1.5 block text-xs text-slate-400">
          Destination
        </label>
        <input
          id="destination"
          name="destination"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            clearError("destination");
            setShowDestSuggestions(true);
          }}
          onFocus={() => setShowDestSuggestions(true)}
          placeholder="Tokyo, Japan"
          autoComplete="off"
          className={`w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 ${
            errors.destination ? "border-red-500" : "border-white/10"
          }`}
        />
        {errors.destination && (
          <p className="mt-1 text-xs text-red-400">{errors.destination}</p>
        )}

        {showDestSuggestions && filteredDestSuggestions.length > 0 && (
          <div className="custom-scrollbar absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl">
            {filteredDestSuggestions.map((place) => (
              <button
                key={place}
                type="button"
                onClick={() => selectDestSuggestion(place)}
                className="block w-full px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                {place}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="budget" className="mb-1.5 block text-xs text-slate-400">
          Budget
        </label>
        <div className="flex gap-1.5">
          {/* Currency selector */}
          <div className="relative shrink-0" ref={currencyRef}>
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

          {/* Amount input */}
          <input
            id="budget"
            name="budget"
            inputMode="numeric"
            value={budgetAmount}
            onChange={(e) => {
              setBudgetAmount(e.target.value.replace(/[^\d]/g, ""));
              clearError("budget");
            }}
            placeholder="1500"
            className={`w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 ${
              errors.budget ? "border-red-500" : "border-white/10"
            }`}
          />
        </div>
        {errors.budget && (
          <p className="mt-1 text-xs text-red-400">{errors.budget}</p>
        )}
      </div>

      <div>
        <label htmlFor="days" className="mb-1.5 block text-xs text-slate-400">
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
          className={`w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 ${
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