"use client";

import { motion } from "framer-motion";
import { Keyboard, Search, Sparkles, PlaneTakeoff } from "lucide-react";
import { Container } from "@/components/ui/container";

const steps = [
  {
    icon: Keyboard,
    number: "01",
    title: "Tell Atlas Your Plan",
    description:
      "Enter your destination, budget, and how many days you're traveling. That's all Atlas needs to get started.",
  },
  {
    icon: Search,
    number: "02",
    title: "AI Researches Everything",
    description:
      "Atlas analyzes flights, hotels, weather, local attractions, and food spots tailored to your destination and budget.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Your Itinerary Is Built",
    description:
      "In seconds, Atlas generates a complete day-by-day plan, personalized insights, and budget-smart recommendations.",
  },
  {
    icon: PlaneTakeoff,
    number: "04",
    title: "Enjoy Your Trip",
    description:
      "Export your itinerary, share it with travel companions, or generate another plan for your next adventure.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-cyan-400">How It Works</p>
          <h2 className="mt-3 text-4xl font-bold lg:text-5xl">
            From idea to itinerary
            <br />
            in four steps
          </h2>
          <p className="mt-4 text-slate-400">
            No spreadsheets, no endless tabs — just tell Atlas where you want to go.
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line for desktop */}
          <div className="absolute top-10 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent lg:block" />

          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-500/20 bg-slate-950 shadow-[0_0_40px_rgba(0,200,255,0.08)]">
                  <Icon className="text-cyan-400" size={28} />
                </div>

                <span className="mt-4 text-xs font-mono text-cyan-500/60">
                  {step.number}
                </span>

                <h3 className="mt-2 text-lg font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}