"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnimatedButtonProps = React.ComponentProps<typeof Button>;

export function AnimatedButton({
  className,
  children,
  ...props
}: AnimatedButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500",
        "shadow-lg shadow-blue-500/20",
        "transition-all duration-300",
        "hover:-translate-y-1",
        "hover:scale-105",
        "hover:shadow-cyan-500/40",
        className
      )}
    >
      {children}
    </Button>
  );
}