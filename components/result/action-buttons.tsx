"use client";

import { Download, Share2 } from "lucide-react";

export default function ActionButtons() {
  return (
    <section className="flex gap-4">

      <button className="flex-1 rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400">
        <Download className="mr-2 inline" size={18} />
        Export PDF
      </button>

      <button className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 transition hover:bg-white/10">
        <Share2 className="mr-2 inline" size={18} />
        Share
      </button>

    </section>
  );
}