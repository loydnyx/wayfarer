"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Cyan Glow */}
      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]"
      />

      {/* Purple Glow */}
      <motion.div
        animate={{
          x: [0, -120, 100, 0],
          y: [0, 100, -60, 0],
          scale: [1.15, 1, 1.2],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-10%] bottom-[-10%] h-[550px] w-[550px] rounded-full bg-violet-500/15 blur-[150px]"
      />

      {/* Blue Glow */}
      <motion.div
        animate={{
          y: [0, 60, -60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[160px]"
      />
    </div>
  );
}