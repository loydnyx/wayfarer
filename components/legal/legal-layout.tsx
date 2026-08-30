"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  lastUpdated: string;
  otherDocHref: string;
  otherDocLabel: string;
  children: React.ReactNode;
};

export default function LegalLayout({
  title,
  lastUpdated,
  otherDocHref,
  otherDocLabel,
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/settings"
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Settings
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {lastUpdated}</p>

        <div className="prose prose-invert prose-sm mt-8 max-w-none sm:prose-base prose-headings:font-semibold prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-a:text-cyan-400">
          {children}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">
            Looking for our other policy?{" "}
            <Link href={otherDocHref} className="text-cyan-400 hover:underline">
              {otherDocLabel}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}