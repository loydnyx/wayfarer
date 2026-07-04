"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Heart, Settings } from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
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
            className={`flex flex-col items-center gap-1 px-3 py-1.5 text-xs ${
              isActive ? "text-cyan-300" : "text-slate-400"
            }`}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}