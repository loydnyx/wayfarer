"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, MapPin } from "lucide-react";
import StreamingResult from "./streaming-result";
import MarkdownText from "./markdown-text";
import type { ItineraryDay } from "@/types/trip";

type Props = {
  itinerary: (ItineraryDay | string)[]; // BAGO — tanggapin din ang lumang string format
  isActive: boolean;
  isDone: boolean;
  onComplete: () => void;
};

// BAGO — i-convert ang lumang string items papuntang bagong shape
function normalizeItem(item: ItineraryDay | string): ItineraryDay {
  if (typeof item === "string") {
    return { day: item, userCost: "", localCost: "" };
  }
  return item;
}

export default function ItineraryTimeline({
  itinerary,
  isActive,
  isDone,
  onComplete,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isActive) setActiveIndex(0);
  }, [isActive]);

  if (!isActive && !isDone) return null;

  const normalizedItinerary = itinerary.map(normalizeItem); // BAGO

  const handleItemComplete = () => {
    if (activeIndex >= normalizedItinerary.length - 1) {
      onComplete();
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const visibleCount = isDone ? normalizedItinerary.length : activeIndex + 1;

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold">Itinerary</h2>

      <AnimatePresence initial={false}>
        {normalizedItinerary.slice(0, visibleCount).map((item, index) => {
          const itemDone = isDone || index < activeIndex;
          const itemActive = isActive && index === activeIndex;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-bold text-black">
                  {index + 1}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="text-slate-300 leading-7">
                    {itemDone && <MarkdownText text={item.day} />}
                    {itemActive && (
                      <StreamingResult
                        text={item.day}
                        speed={4}
                        onComplete={handleItemComplete}
                      />
                    )}
                  </div>

                  {itemDone && (item.userCost || item.localCost) && (
                    <div className="flex flex-wrap gap-2">
                      {item.userCost && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                          <Wallet size={12} />
                          {item.userCost}
                        </span>
                      )}
                      {item.localCost && item.localCost !== item.userCost && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
                          <MapPin size={12} />
                          {item.localCost}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </section>
  );
}