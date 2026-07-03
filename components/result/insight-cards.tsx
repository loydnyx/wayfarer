"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import StreamingResult from "./streaming-result";
import MarkdownText from "./markdown-text";

type Props = {
  tips: string[];
  isActive: boolean;
  isDone: boolean;
  onComplete: () => void;
};

export default function InsightCards({ tips, isActive, isDone, onComplete }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isActive) setActiveIndex(0);
  }, [isActive]);

  if (!tips?.length) return null;
  if (!isActive && !isDone) return null;

  const handleItemComplete = () => {
    if (activeIndex >= tips.length - 1) {
      onComplete();
    } else {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const visibleCount = isDone ? tips.length : activeIndex + 1;

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-cyan-400" />
        <h2 className="text-xl font-semibold">Atlas AI Insights</h2>
      </div>

      <div className="grid gap-4">
        <AnimatePresence initial={false}>
          {tips.slice(0, visibleCount).map((tip, index) => {
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
                {itemDone && <MarkdownText text={tip} />}
                {itemActive && (
                  <StreamingResult
                    text={tip}
                    speed={5}
                    onComplete={handleItemComplete}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}