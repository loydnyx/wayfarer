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
          <div>
            <HeroBadge />

            <h1 className="mt-8 text-6xl font-black leading-tight lg:text-7xl">
              Plan Smarter.
              <br />
              <GradientText>Travel Further.</GradientText>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
              Atlas builds personalized travel plans, predicts your expenses,
              recommends flights, hotels, restaurants, and creates the perfect
              itinerary in seconds.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <AnimatedButton size="lg">Start Planning</AnimatedButton>
              <AnimatedButton size="lg" variant="outline" className="bg-transparent">
                Watch Demo
              </AnimatedButton>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <div className="relative px-16 py-12">
              <FloatingWidgets />
              <PlannerFlow />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}