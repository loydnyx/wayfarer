"use client";

import { motion } from "framer-motion";
import StreamingResult from "./streaming-result";
import MarkdownText from "./markdown-text";

type Props = {
  summary: string;
  isActive: boolean;
  isDone: boolean;
  onComplete: () => void;
};

export default function AIIntro({ summary, isActive, isDone, onComplete }: Props) {
  if (!isActive && !isDone) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-6"
    >
      <h3 className="mb-4 text-cyan-300 font-semibold">Atlas AI Summary</h3>

      <div className="leading-8 text-slate-300">
        {isDone && <MarkdownText text={summary} />}
        {isActive && <StreamingResult text={summary} onComplete={onComplete} />}
      </div>
    </motion.section>
  );
}