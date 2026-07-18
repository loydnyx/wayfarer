"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripInput } from "@/types/trip";
import { POPULAR_DESTINATIONS } from "@/lib/destinations";
import { CURRENCIES } from "@/lib/currencies";
import { useUserCurrency } from "@/hooks/use-user-currency";

type Props = {
  onGenerate: (trip: TripInput) => void;
};

type Step = "destination" | "origin" | "budget" | "days" | "confirm";

type Message = {
  id: string;
  role: "ai" | "user";
  content: string;
};

type PersistedState = {
  messages: Message[];
  step: Step;
  origin: string;
  destination: string;
  budgetAmount: string;
  budgetCurrency: string;
  days: string;
};

const STORAGE_KEY = "atlas_planner_state";
const DAY_CHIPS = ["3", "5", "7", "10", "14"];
const GREETING: Message = { id: "q1", role: "ai", content: "Hey! Where do you want to go?" };

function loadPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function PlannerForm({ onGenerate }: Props) {
  const { currencyCode: preferredCurrency } = useUserCurrency();
  const searchParams = useSearchParams();

  const persisted = useRef(loadPersisted()).current;

  const [messages, setMessages] = useState<Message[]>(() => persisted?.messages ?? [GREETING]);
  const [step, setStep] = useState<Step>(() => persisted?.step ?? "destination");

  const [origin, setOrigin] = useState(() => persisted?.origin ?? "");
  const [destination, setDestination] = useState(() => persisted?.destination ?? "");
  const [budgetAmount, setBudgetAmount] = useState(() => persisted?.budgetAmount ?? "");
  const [budgetCurrency, setBudgetCurrency] = useState(() => persisted?.budgetCurrency ?? "PHP");
  const [days, setDays] = useState(() => persisted?.days ?? "");

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    setBudgetCurrency(preferredCurrency);
  }, [preferredCurrency]);

  // Prefill destination from ?destination= query param, skip straight past it
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (persisted) return; // may existing conversation na, huwag i-override

    const destParam = searchParams.get("destination");
    if (destParam) {
      setDestination(destParam);
      setMessages([
        GREETING,
        { id: "a1", role: "user", content: destParam },
      ]);
      setStep("origin");
      addMessage("ai", "Nice pick. Where are you flying from? You can skip this.");
    }
  }, [searchParams]);

  // I-save ang state tuwing may pagbabago
  useEffect(() => {
    const toSave: PersistedState = {
      messages,
      step,
      origin,
      destination,
      budgetAmount,
      budgetCurrency,
      days,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [messages, step, origin, destination, budgetAmount, budgetCurrency, days]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    textInputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addMessage = (role: Message["role"], content: string) => {
    setMessages((prev) => [...prev, { id: `${role}-${Date.now()}`, role, content }]);
  };

  const suggestions =
    inputValue.trim().length > 0 && (step === "destination" || step === "origin")
      ? POPULAR_DESTINATIONS.filter((d) =>
          d.toLowerCase().includes(inputValue.toLowerCase())
        ).slice(0, 6)
      : [];

  const askOriginQuestion = () => {
    setStep("origin");
    setInputValue("");
    addMessage("ai", "Nice pick. Where are you flying from? You can skip this.");
  };

  const askBudgetQuestion = () => {
    setStep("budget");
    setInputValue("");
    addMessage("ai", "Got it. What's your budget for the trip?");
  };

  const askDaysQuestion = () => {
    setStep("days");
    setInputValue("");
    addMessage("ai", "And how many days are you planning for?");
  };

  const askConfirm = (finalDays: string) => {
    setStep("confirm");
    const currency = CURRENCIES.find((c) => c.code === budgetCurrency);
    addMessage(
      "ai",
      `Perfect — ${finalDays} days in ${destination}${
        origin ? ` from ${origin}` : ""
      }, budget ${currency?.symbol ?? ""}${budgetAmount} ${budgetCurrency}. Ready when you are.`
    );
  };

  const handleDestinationSubmit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Tell me where you'd like to go");
      return;
    }
    setDestination(trimmed);
    setError("");
    addMessage("user", trimmed);
    setShowSuggestions(false);
    askOriginQuestion();
  };

  const handleOriginSubmit = (value: string) => {
    const trimmed = value.trim();
    setOrigin(trimmed);
    addMessage("user", trimmed || "Skip");
    setShowSuggestions(false);
    askBudgetQuestion();
  };

  const handleBudgetSubmit = (value: string) => {
    const digitsOnly = value.replace(/[^\d]/g, "");
    if (!digitsOnly) {
      setError("Enter an amount");
      return;
    }
    setBudgetAmount(digitsOnly);
    setError("");
    const currency = CURRENCIES.find((c) => c.code === budgetCurrency);
    addMessage("user", `${currency?.symbol ?? ""}${digitsOnly} ${budgetCurrency}`);
    askDaysQuestion();
  };

  const handleDaysSubmit = (value: string) => {
    const dayCount = parseInt(value);
    if (!value.trim() || isNaN(dayCount) || dayCount <= 0) {
      setError("Enter a valid number of days");
      return;
    }
    if (dayCount > 30) {
      setError("Max 30 days");
      return;
    }
    setDays(value.trim());
    setError("");
    addMessage("user", value.trim());
    askConfirm(value.trim());
  };

  const handleSubmit = () => {
    const currency = CURRENCIES.find((c) => c.code === budgetCurrency);
    const formattedBudget = `${currency?.symbol ?? ""}${budgetAmount} ${budgetCurrency}`;

    sessionStorage.removeItem(STORAGE_KEY);

    onGenerate({
      destination,
      origin: origin || undefined,
      budget: formattedBudget,
      days,
    });
  };

  const handleRestart = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setMessages([GREETING]);
    setStep("destination");
    setOrigin("");
    setDestination("");
    setBudgetAmount("");
    setDays("");
    setInputValue("");
    setError("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (step === "destination") handleDestinationSubmit(inputValue);
    if (step === "origin") handleOriginSubmit(inputValue);
    if (step === "budget") handleBudgetSubmit(inputValue);
    if (step === "days") handleDaysSubmit(inputValue);
  };

  const selectSuggestion = (value: string) => {
    if (step === "destination") handleDestinationSubmit(value);
    if (step === "origin") handleOriginSubmit(value);
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === budgetCurrency);

  const placeholder =
    step === "destination"
      ? "Tokyo, Japan"
      : step === "origin"
      ? "Manila, Philippines"
      : step === "budget"
      ? "1500"
      : step === "days"
      ? "7"
      : "";

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      {/* Header with restart button */}
      {messages.length > 1 && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-xs text-slate-500">Planning your trip</span>
          <button
            type="button"
            onClick={handleRestart}
            className="text-xs text-slate-500 transition-colors hover:text-cyan-300"
          >
            Start over
          </button>
        </div>
      )}

      {/* Chat thread */}
      <div
        ref={scrollRef}
        className="custom-scrollbar flex max-h-[420px] flex-col gap-3 overflow-y-auto p-5"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "ai" && (
              <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs text-cyan-300">
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                m.role === "user"
                  ? "rounded-tr-sm bg-cyan-500 text-white"
                  : "rounded-tl-sm border border-white/10 bg-white/5 text-slate-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {step === "days" && (
          <div className="ml-9 flex flex-wrap gap-2">
            {DAY_CHIPS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDaysSubmit(d)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
              >
                {d} days
              </button>
            ))}
          </div>
        )}

        {step === "origin" && (
          <div className="ml-9">
            <button
              type="button"
              onClick={() => handleOriginSubmit("")}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
            >
              Skip
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="ml-9">
            <Button onClick={handleSubmit}>Generate trip</Button>
          </div>
        )}
      </div>

      {/* Input bar */}
      {step !== "confirm" && (
        <div className="border-t border-white/10 p-3">
          {error && <p className="mb-2 px-1 text-xs text-red-400">{error}</p>}

          <div className="flex items-center gap-2">
            {step === "budget" && (
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
                  <div className="custom-scrollbar absolute bottom-full left-0 z-20 mb-1 max-h-48 w-36 overflow-y-auto rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl">
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
            )}

            <div className="relative flex-1" ref={step !== "budget" ? inputRef : undefined}>
              <input
                ref={textInputRef}
                value={inputValue}
                inputMode={step === "budget" || step === "days" ? "numeric" : "text"}
                onChange={(e) => {
                  const val =
                    step === "budget" ? e.target.value.replace(/[^\d]/g, "") : e.target.value;
                  setInputValue(val);
                  setError("");
                  if (step === "destination" || step === "origin") setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (step === "destination" || step === "origin") setShowSuggestions(true);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={placeholder}
                autoComplete="off"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="custom-scrollbar absolute bottom-full z-10 mb-1 max-h-48 w-full overflow-y-auto rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl">
                  {suggestions.map((place) => (
                    <button
                      key={place}
                      type="button"
                      onClick={() => selectSuggestion(place)}
                      className="block w-full px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300"
                    >
                      {place}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              className="shrink-0"
              onClick={() => {
                if (step === "destination") handleDestinationSubmit(inputValue);
                if (step === "origin") handleOriginSubmit(inputValue);
                if (step === "budget") handleBudgetSubmit(inputValue);
                if (step === "days") handleDaysSubmit(inputValue);
              }}
            >
              →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}