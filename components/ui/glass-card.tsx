import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function GlassCard({
  children,
  className,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl",
        "transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}