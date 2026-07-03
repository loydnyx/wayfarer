"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 2,
        duration: Math.random() * 12 + 14,
        delay: Math.random() * 10,
      }))
    );
  }, []);

  return (
    <>
      {/* Grid + glows — behind everything, scrolls with the page */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, 120, -80, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, -120, 100, 0],
            y: [0, 100, -60, 0],
            scale: [1.15, 1, 1.2],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-10%] bottom-[-10%] h-[550px] w-[550px] rounded-full bg-violet-500/15 blur-[150px]"
        />

        <motion.div
          animate={{ y: [0, 60, -60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[160px]"
        />
      </div>

      {/* Particles — fixed to viewport, sits above the background color but below content */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-300/70"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              bottom: "-5%",
            }}
            animate={{
              y: ["0vh", "-105vh"],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </>
  );
}