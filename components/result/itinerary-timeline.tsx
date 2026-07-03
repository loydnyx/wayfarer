"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StreamingResult from "./streaming-result";
import MarkdownText from "./markdown-text";

type Props = {
  itinerary: string[];
  isActive: boolean;
  isDone: boolean;
  onComplete: () => void;
};

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

  const handleItemComplete = () => {
    if (activeIndex >= itinerary.length - 1) {
      onComplete();
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const visibleCount = isDone ? itinerary.length : activeIndex + 1;

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-semibold">Itinerary</h2>

      <AnimatePresence initial={false}>
        {itinerary.slice(0, visibleCount).map((item, index) => {
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

                <div className="text-slate-300 leading-7">
                  {itemDone && <MarkdownText text={item} />}
                  {itemActive && (
                    <StreamingResult
                      text={item}
                      speed={4}
                      onComplete={handleItemComplete}
                    />
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