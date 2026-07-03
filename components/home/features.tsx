"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Wallet,
  Hotel,
  UtensilsCrossed,
  CloudSun,
  Route,
} from "lucide-react";
import { Container } from "@/components/ui/container";

const features = [
  {
    icon: Sparkles,
    title: "AI Itinerary Generation",
    description:
      "Just tell us where, when, and your budget — Atlas builds a complete day-by-day travel plan in seconds.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Wallet,
    title: "Smart Budget Prediction",
    description:
      "Get realistic cost estimates for flights, stays, food, and activities, tailored to your travel style.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Hotel,
    title: "Hotel Recommendations",
    description:
      "Atlas surfaces the best-rated stays that match your budget and preferred location.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: UtensilsCrossed,
    title: "Local Food Discovery",
    description:
      "Find must-try restaurants and street food spots recommended for every stop on your trip.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: CloudSun,
    title: "Weather-Aware Planning",
    description:
      "Your itinerary adapts around expected weather, so you're never caught off guard.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Route,
    title: "Optimized Routes",
    description:
      "Atlas arranges your daily activities in the most efficient order, saving time and travel hassle.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-cyan-400">Features</p>
          <h2 className="mt-3 text-4xl font-bold lg:text-5xl">
            Everything you need,
            <br />
            planned by AI
          </h2>
          <p className="mt-4 text-slate-400">
            Atlas handles the research so you can focus on the adventure.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-cyan-500/30 hover:bg-white/[0.07]"
              >
                <div className={`inline-flex rounded-xl ${feature.bg} p-3`}>
                  <Icon className={feature.color} size={22} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}