"use client";

import { motion } from "framer-motion";
import PlannerFlow from "@/components/planner/planner-flow";
import FloatingWidgets from "./floating-widgets";

import { HeroBadge } from "@/components/ui/hero-badge";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Container } from "@/components/ui/container";

export default function Hero() {
  return (
    <section className="relative py-20">
      <Container>
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <HeroBadge />

            <h1 className="mt-8 text-6xl font-black leading-tight lg:text-7xl">
              Plan Smarter.
              <br />
              <GradientText>Travel Further.</GradientText>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
              Wayfarer builds personalized travel plans, predicts your expenses,
              recommends flights, hotels, restaurants, and creates the perfect
              itinerary in seconds.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <AnimatedButton size="lg">Start Planning</AnimatedButton>
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
            <div className="relative px-16 py-12">
              <FloatingWidgets />
              <PlannerFlow />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}