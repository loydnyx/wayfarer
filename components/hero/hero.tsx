"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import PlannerFlow from "@/components/planner/planner-flow";
import FloatingWidgets from "./floating-widgets";
import MobilePlannerSheet from "./mobile-planner-sheet";

import { HeroBadge } from "@/components/ui/hero-badge";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Container } from "@/components/ui/container";

export default function Hero() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <section className="relative overflow-x-clip pb-16 pt-24 sm:pt-28 lg:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <HeroBadge />

            <h1 className="mt-6 text-4xl font-black leading-tight sm:mt-8 sm:text-6xl lg:text-7xl">
              Plan Smarter.
              <br />
              <GradientText>Travel Further.</GradientText>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-400 sm:mt-8 sm:text-lg sm:leading-8">
              Wayfarer builds personalized travel plans, predicts your expenses,
              recommends flights, hotels, restaurants, and creates the perfect
              itinerary in seconds.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 sm:mt-10">
              <AnimatedButton size="lg" className="hidden lg:inline-flex">
                Start Planning
              </AnimatedButton>
              <AnimatedButton size="lg" variant="outline" className="bg-transparent">
                Watch Demo
              </AnimatedButton>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            {/* Desktop planner */}
            <div className="relative hidden px-20 py-15 lg:-translate-x-8 lg:block">
              <FloatingWidgets />
              <PlannerFlow />
            </div>

            {/* Mobile trigger card */}
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="flex w-full items-center gap-4 rounded-2xl border border-cyan-500/20 bg-white/5 p-5 text-left transition-colors hover:border-cyan-500/40 lg:hidden"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                <Sparkles className="text-cyan-400" size={22} />
              </div>
              <div>
                <p className="font-semibold text-white">Tap to start planning</p>
                <p className="mt-0.5 text-sm text-slate-400">
                  Destination, budget, and days — AI does the rest.
                </p>
              </div>
            </button>
          </motion.div>
        </div>
      </Container>

      <MobilePlannerSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </section>
  );
}