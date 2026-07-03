import { cn } from "@/lib/utils";

export function Display({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-5xl md:text-7xl font-black tracking-tight",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-3xl font-bold",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function Body({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-base text-slate-400",
        className
      )}
    >
      {children}
    </p>
  );
}