"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ThinkingOrb } from "thinking-orbs";
import { useEffect, useState } from "react";

const steps = [
  { text: "Sending your trip details", orbState: "searching" as const },
  { text: "Generating your itinerary with AI", orbState: "solving" as const },
  { text: "Fetching destination photos", orbState: "searching" as const },
  { text: "Putting it all together", orbState: "composing" as const },
];

export default function AIConsole() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c >= steps.length - 1 ? c : c + 1));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-black/40 p-8 backdrop-blur-xl sm:p-10">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        {/* Thinking orb — nagbabago ang state kasabay ng bawat step */}
        <div className="flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
          <AnimatePresence mode="wait">
            <motion.div
              key={steps[current].orbState}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="scale-125 sm:scale-150"
            >
              <ThinkingOrb state={steps[current].orbState} size={64} theme="dark" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Eyebrow */}
        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-400/70 sm:mt-8">
          Atlas AI
        </p>

        {/* Crossfading step text */}
        <div className="mt-2 flex h-8 items-center justify-center sm:h-9">
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-base font-medium text-white sm:text-lg"
            >
              {steps[current].text}...
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Segmented progress bar */}
        <div className="mt-6 flex w-full max-w-[240px] gap-1.5 sm:mt-8">
          {steps.map((_, index) => (
            <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-cyan-400"
                initial={{ width: "0%" }}
                animate={{
                  width: index < current ? "100%" : index === current ? "100%" : "0%",
                }}
                transition={{ duration: index === current ? 1.6 : 0.3, ease: "easeInOut" }}
              />
            </div>
          ))}
        </div>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-6 text-[11px] text-slate-500 sm:mt-8 sm:text-xs"
        >
          This can take a few seconds depending on itinerary complexity.
        </motion.p>
      </div>
    </div>
  );
}