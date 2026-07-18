"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ImageIcon, Sparkles, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { FavoriteDestination } from "@/lib/trips/favorites";

type UnsplashImage = {
  id?: string;
  url: string;
  thumbUrl: string;
  alt: string;
  credit: string;
  creditLink: string;
  downloadLocation?: string | null;
};

export type FavoriteWithImage = FavoriteDestination & {
  image: UnsplashImage | null;
  imageLoading: boolean;
};

type Props = {
  items: FavoriteWithImage[];
  onRemove: (id: string) => void;
};

const MAX_FLOATING_CARDS = 4;

function withUtm(url: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}utm_source=wayfarer&utm_medium=referral`;
}

export default function FavoritesCarousel({ items, onRemove }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = activeIndex >= items.length ? 0 : activeIndex;

  if (items.length === 0) return null;

  const active = items[safeIndex];

  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % items.length);

  const upcoming = Array.from({ length: Math.min(MAX_FLOATING_CARDS, items.length - 1) }).map(
    (_, i) => items[(safeIndex + i + 1) % items.length]
  );

  return (
    <div className="relative h-[30rem] w-full sm:h-[30rem] lg:h-[34rem]">
      {/* Featured background image */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-pink-500/10 via-slate-900 to-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {active.image ? (
              <img
                src={active.image.url}
                alt={active.image.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {active.imageLoading ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-400 border-t-transparent" />
                ) : (
                  <ImageIcon className="text-pink-400/40" size={40} />
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/50 via-transparent to-transparent sm:block" />
          </motion.div>
        </AnimatePresence>

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(active.id)}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-slate-300 backdrop-blur-sm transition-colors hover:bg-red-500/80 hover:text-white"
          title="Remove favorite"
        >
          <X size={16} />
        </button>

        {/* Manual nav arrows + counter */}
        {items.length > 1 && (
          <div className="absolute left-5 top-4 z-20 flex items-center gap-2">
            <button
              onClick={goPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium text-white/80">
              {safeIndex + 1} / {items.length}
            </span>
            <button
              onClick={goNext}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Bottom content — buong lapad sa mobile, stacked nang maayos */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2.5 p-5 sm:inset-y-0 sm:right-auto sm:max-w-[45%] sm:justify-end sm:gap-3 sm:p-8">
          <div className="flex items-center gap-2">
            <Heart size={15} className="shrink-0 fill-pink-400 text-pink-400" />
            <h3 className="truncate text-lg font-bold leading-tight text-white sm:text-3xl">
              {active.destination_name}
            </h3>
          </div>

          <p className="hidden text-sm text-slate-300 sm:block">
            One of your saved dream destinations — ready whenever you are.
          </p>

          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/dashboard/plan?destination=${encodeURIComponent(active.destination_name)}`}
              className="flex w-fit shrink-0 items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-cyan-400"
            >
              <Sparkles size={14} />
              Plan a Trip
            </Link>

            {/* Attribution — katabi ng button sa mobile, hindi na overlapping */}
            {active.image && (
              <p className="flex min-w-0 items-center gap-1 truncate text-[9px] text-slate-400 sm:hidden">
                <span className="truncate">
                  Photo:{" "}
                  <a
                    href={withUtm(active.image.creditLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline"
                  >
                    {active.image.credit}
                  </a>
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Attribution — desktop lang, hiwalay na linya sa ibaba */}
        {active.image && (
          <p className="absolute bottom-3 left-8 z-10 hidden items-center gap-1 text-[10px] text-slate-400 sm:flex">
            <span>Photo by</span>
            <a
              href={withUtm(active.image.creditLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline"
            >
              {active.image.credit}
            </a>
            <span>on</span>
            <a
              href={withUtm("https://unsplash.com")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 hover:text-white hover:underline"
            >
              Unsplash
              <ExternalLink size={9} />
            </a>
          </p>
        )}
      </div>

      {/* Floating stacked cards — desktop lang */}
      <div className="pointer-events-none absolute inset-y-6 right-6 z-10 hidden w-40 sm:block">
        {upcoming.map((item, i) => {
          const realIndex = (safeIndex + i + 1) % items.length;

          return (
            <motion.div
              key={item.id}
              initial={false}
              animate={{
                top: `${i * 25}%`,
                opacity: 1 - i * 0.12,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="pointer-events-auto absolute left-0 right-0 h-24 sm:h-28"
              style={{ zIndex: MAX_FLOATING_CARDS - i }}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(realIndex)}
                className="group block h-full w-full overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl transition-transform hover:scale-105 hover:border-cyan-400"
              >
                {item.image ? (
                  <img
                    src={item.image.thumbUrl}
                    alt={item.image.alt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-500/10 via-slate-900 to-black">
                    <ImageIcon className="text-pink-400/40" size={16} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <p className="absolute inset-x-0 bottom-1.5 truncate px-2 text-[10px] font-semibold text-white sm:text-xs">
                  {item.destination_name}
                </p>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}