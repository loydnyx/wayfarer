"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Sparkles, MapPin, Heart, Settings } from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Plan a Trip", href: "/dashboard/plan", icon: Sparkles },
  { label: "My Trips", href: "/dashboard/trips", icon: MapPin },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-slate-950/50 p-6 lg:flex"
    >
      <Link href="/" className="mb-10 text-xl font-bold tracking-tight text-white">
        Wayfarer
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ x: -12, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05, ease: "easeOut" }}
            >
              <Link
                href={item.href}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 h-6 w-0.5 rounded-full bg-cyan-400"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={18} />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}