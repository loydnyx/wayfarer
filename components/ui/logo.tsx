import Link from "next/link";
import { Compass } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 group"
    >
      <div
        className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-2xl
        bg-gradient-to-br
        from-blue-500
        to-cyan-400
        text-white
        shadow-lg
        transition-transform
        duration-300
        group-hover:scale-105
      "
      >
        <Compass className="h-5 w-5" />
      </div>

      <div>
        <h1 className="text-lg font-bold tracking-tight">
          Atlas
        </h1>

        <p className="text-xs text-slate-400">
          AI Travel OS
        </p>
      </div>
    </Link>
  );
}