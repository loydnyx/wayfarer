"use client";

import { motion } from "framer-motion";
import { Target, Bot, PiggyBank, CloudSun } from "lucide-react";
import { Container } from "@/components/ui/container";

const reasons = [
  {
    icon: Target,
    title: "Reverse Planning",
    description:
      "Start with your dream trip in mind — Atlas works backward to find the best route, timing, and budget to make it happen.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Bot,
    title: "AI Travel Strategist",
    description:
      "Not just a search engine — Atlas thinks through your preferences and builds a plan tailored specifically to you.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: PiggyBank,
    title: "Smart Budget Optimization",
    description:
      "Get the most out of every peso or dollar. Atlas balances splurges and savings so you experience more without overspending.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: CloudSun,
    title: "Live Weather Awareness",
    description:
      "Your itinerary isn't static — it factors in seasonal weather patterns so you're never caught off guard mid-trip.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
];

export default function WhyAtlas() {
  return (
    <section id="why-atlas" className="relative py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-cyan-400">Why Atlas?</p>
          <h2 className="mt-3 text-4xl font-bold lg:text-5xl">
            Not just another
            <br />
            travel planner
          </h2>
          <p className="mt-4 text-slate-400">
            Atlas thinks like a strategist, not a search bar.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;

            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-cyan-500/30 hover:bg-white/[0.07]"
              >
                <div className={`h-fit shrink-0 rounded-xl ${reason.bg} p-3`}>
                  <Icon className={reason.color} size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}