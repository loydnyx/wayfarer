"use client";

import { motion } from "framer-motion";

const steps = [
  "Searching flights...",
  "Comparing hotels...",
  "Checking weather...",
  "Finding restaurants...",
  "Optimizing itinerary...",
];

export default function ThinkingAnimation() {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: index * 0.45,
            duration: 0.45,
          }}
          className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3"
        >
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
            }}
            className="h-2 w-2 rounded-full bg-cyan-400"
          />

          <span className="text-sm text-slate-300">
            {step}
          </span>
        </motion.div>
      ))}
    </div>
  );
}