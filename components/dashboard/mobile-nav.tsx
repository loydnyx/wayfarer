"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, MapPin, Heart, Settings } from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Plan", href: "/dashboard/plan", icon: Sparkles },
  { label: "Trips", href: "/dashboard/trips", icon: MapPin },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around border-t border-white/10 bg-slate-950/95 py-2 backdrop-blur-xl lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-2 py-1.5 text-[10px] ${
              isActive ? "text-cyan-300" : "text-slate-400"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}