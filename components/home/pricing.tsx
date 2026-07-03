"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CURRENCIES, formatPrice } from "@/lib/currencies";

const plans = [
  {
    name: "Free",
    priceMonthlyPHP: 0,
    description: "Perfect for planning your next getaway.",
    features: [
      "5 AI-generated trips per month",
      "Basic itinerary suggestions",
      "Budget estimates",
      "Export to PDF",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    priceMonthlyPHP: 249,
    description: "For frequent travelers who want it all.",
    features: [
      "Unlimited AI-generated trips",
      "Advanced personalization",
      "Real-time weather sync",
      "Priority AI processing",
      "Shareable trip links",
      "Export to PDF & Calendar",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    priceMonthlyPHP: 799,
    description: "Plan group trips with friends or colleagues.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Collaborative trip editing",
      "Shared trip library",
      "Dedicated support",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  const [currencyCode, setCurrencyCode] = useState("PHP");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({ PHP: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/exchange-rates")
      .then((res) => res.json())
      .then((data) => {
        setRates(data.rates);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currency = CURRENCIES.find((c) => c.code === currencyCode)!;

  return (
    <section id="pricing" className="relative py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-cyan-400">Pricing</p>
          <h2 className="mt-3 text-4xl font-bold lg:text-5xl">
            Simple pricing,
            <br />
            wherever you are
          </h2>
          <p className="mt-4 text-slate-400">
            Choose your currency and find the plan that fits your travel style.
          </p>

          <div className="relative mx-auto mt-6 w-fit">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500/30"
            >
              {currency.code} — {currency.label}
              <ChevronDown size={14} />
            </button>

                {dropdownOpen && (
                <div className="custom-scrollbar absolute left-1/2 z-20 mt-2 max-h-64 w-56 -translate-x-1/2 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl">
                    {CURRENCIES.map((c) => (
                    <button
                        key={c.code}
                        onClick={() => {
                        setCurrencyCode(c.code);
                        setDropdownOpen(false);
                        }}
                        className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-cyan-500/10 hover:text-cyan-300 ${
                        c.code === currencyCode ? "text-cyan-300" : "text-slate-300"
                        }`}
                    >
                        {c.code} — {c.label}
                    </button>
                    ))}
                </div>
                )}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative rounded-3xl border p-8 ${
                plan.highlighted
                  ? "border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_60px_rgba(0,200,255,0.1)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-3 py-1 text-xs font-medium text-black">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{plan.description}</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-white">
                  {plan.priceMonthlyPHP === 0
                    ? "Free"
                    : loading
                    ? "..."
                    : formatPrice(plan.priceMonthlyPHP, currencyCode, rates)}
                </span>
                {plan.priceMonthlyPHP > 0 && (
                  <span className="text-sm text-slate-400"> / month</span>
                )}
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check size={16} className="mt-0.5 shrink-0 text-cyan-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full rounded-xl py-3 text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-cyan-500 text-black hover:bg-cyan-400"
                    : "border border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {plan.priceMonthlyPHP === 0 ? "Get Started" : "Choose Plan"}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Prices are converted using live exchange rates and may vary slightly at checkout.
        </p>
      </Container>
    </section>
  );
}