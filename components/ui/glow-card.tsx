"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type GlowCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function GlowCard({ children, className, ...props }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn("group relative isolate overflow-hidden", className)}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(150px circle at ${position.x}% ${position.y}%, rgba(34, 211, 238, 0.15), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}