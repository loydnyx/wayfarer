"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CloudSun, Plane, Wallet, Hotel } from "lucide-react";

const weatherOptions = [
  "Sunny, 28°C",
  "Clear, 24°C",
  "Cloudy, 26°C",
  "Warm, 30°C",
  "Mild, 22°C",
];

const flightOptions = ["Available", "Confirmed", "Best Fare"];

const budgetOptions = ["On Track", "Optimized", "In Range"];

const hotelCounts = [634, 721, 842, 913, 1024, 1187];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function FloatingWidgets() {
  const [values, setValues] = useState({
    weather: weatherOptions[0],
    flight: flightOptions[0],
    budget: budgetOptions[0],
    hotels: `${hotelCounts[0]} Found`,
  });

  useEffect(() => {
    setValues({
      weather: pickRandom(weatherOptions),
      flight: pickRandom(flightOptions),
      budget: pickRandom(budgetOptions),
      hotels: `${pickRandom(hotelCounts)} Found`,
    });
  }, []);

  const widgets = [
    {
      icon: CloudSun,
      label: "Weather",
      value: values.weather,
      position: "top-[-1rem] left-[-5rem] xl:left-[-7rem] 2xl:left-[-10rem]",
      floatDelay: 0,
      color: "text-yellow-300",
    },
    {
      icon: Plane,
      label: "Flight",
      value: values.flight,
      position: "top-[8rem] right-[-6rem] xl:right-[-8rem] 2xl:right-[-11rem]",
      floatDelay: 0.4,
      color: "text-cyan-300",
    },
    {
      icon: Wallet,
      label: "Budget",
      value: values.budget,
      position: "bottom-[8rem] left-[-6rem] xl:left-[-8rem] 2xl:left-[-11rem]",
      floatDelay: 0.8,
      color: "text-green-300",
    },
    {
      icon: Hotel,
      label: "Hotels",
      value: values.hotels,
      position: "bottom-[-1rem] right-[-5rem] xl:right-[-7rem] 2xl:right-[-10rem]",
      floatDelay: 1.2,
      color: "text-purple-300",
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {widgets.map((widget, i) => {
        const Icon = widget.icon;

        return (
          <motion.div
            key={widget.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.5 + i * 0.15 },
              scale: { duration: 0.6, delay: 0.5 + i * 0.15 },
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: widget.floatDelay,
              },
            }}
            className={`absolute ${widget.position} flex w-48 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl shadow-lg`}
          >
            <div className={`shrink-0 rounded-lg bg-white/10 p-2 ${widget.color}`}>
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400">{widget.label}</p>
              <p className="truncate text-sm font-medium text-white">{widget.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}