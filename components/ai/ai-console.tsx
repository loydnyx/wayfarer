"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Search,
  Hotel,
  CloudSun,
  Route,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  { icon: Brain, text: "Analyzing your request..." },
  { icon: Search, text: "Searching destination data..." },
  { icon: Hotel, text: "Finding hotels and activities..." },
  { icon: CloudSun, text: "Checking weather trends..." },
  { icon: Route, text: "Optimizing itinerary..." },
  { icon: Sparkles, text: "Generating your travel plan..." },
];

export default function AIConsole() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c >= steps.length - 1 ? c : c + 1));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          <Brain className="text-cyan-400" size={22} />
        </motion.div>

        <div>
          <h2 className="font-semibold text-white text-sm sm:text-base">Atlas AI</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Building your personalized itinerary...
          </p>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const completed = index < current;
          const active = index === current;

          return (
            <motion.div
              key={step.text}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 sm:gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 sm:px-4 sm:py-3"
            >
              {completed ? (
                <CheckCircle2 size={16} className="shrink-0 text-green-400" />
              ) : (
                <motion.div
                  animate={active ? { rotate: 360 } : {}}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="shrink-0"
                >
                  <Icon size={16} className={active ? "text-cyan-400" : "text-slate-500"} />
                </motion.div>
              )}

              <span
                className={`text-xs sm:text-sm ${
                  active ? "text-white" : completed ? "text-green-300" : "text-slate-500"
                }`}
              >
                {step.text}
              </span>

              {active && (
                <AnimatePresence>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-auto text-cyan-400"
                  >
                    ●
                  </motion.span>
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-4 sm:mt-6 text-center text-[10px] sm:text-xs text-slate-500"
      >
        AI may take a few seconds depending on itinerary complexity.
      </motion.div>
    </div>
  );
}