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
        "relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500",
        "shadow-lg shadow-blue-500/20",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/40",
        "active:translate-y-0 active:scale-[0.98] active:shadow-md active:shadow-cyan-500/20",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent",
        "hover:before:translate-x-full hover:before:transition-transform hover:before:duration-700",
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </Button>
  );
}