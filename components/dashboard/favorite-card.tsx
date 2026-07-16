"use client";

import { useEffect, useState } from "react";
import { Heart, X, ImageIcon, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { FavoriteDestination } from "@/lib/trips/favorites";

type UnsplashImage = {
    url: string;
    thumbUrl: string;
    alt: string;
    credit: string;
    creditLink: string;
};

type Props = {
    favorite: FavoriteDestination;
    onRemove: (id: string) => void;
};

function getBroadFallback(destination: string): string {
    const parts = destination.split(",").map((p) => p.trim());
    return parts[parts.length - 1] || destination;
}

function withUtm(url: string) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}utm_source=wayfarer&utm_medium=referral`;
}

export default function FavoriteCard({ favorite, onRemove }: Props) {
    const [image, setImage] = useState<UnsplashImage | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false); // BAGO

    useEffect(() => {
        const fallback = getBroadFallback(favorite.destination_name);

        fetch(
            `/api/images?query=${encodeURIComponent(
                favorite.destination_name
            )}&count=1&fallback=${encodeURIComponent(fallback)}`
        )
            .then((res) => res.json())
            .then((data) => setImage(data.images?.[0] ?? null))
            .catch(() => setImage(null))
            .finally(() => setLoading(false));
    }, [favorite.destination_name]);

    // BAGO — Escape key at body scroll lock
    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false);
        };

        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [lightboxOpen]);

    return (
        <>
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-pink-500/30">
                <div
                    onClick={() => image && setLightboxOpen(true)} // BAGO
                    className={`relative h-28 w-full overflow-hidden bg-gradient-to-br from-pink-500/10 via-slate-900 to-black sm:h-32 ${image ? "cursor-zoom-in" : ""
                        }`}
                >
                    {loading ? (
                        <div className="flex h-full w-full items-center justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-400 border-t-transparent" />
                        </div>
                    ) : image ? (
                        <img
                            src={image.thumbUrl}
                            alt={image.alt}
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="text-pink-400/40" size={24} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation(); // BAGO — para hindi magbukas ng lightbox
                            onRemove(favorite.id);
                        }}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-slate-300 backdrop-blur-sm transition-colors hover:bg-red-500/80 hover:text-white"
                        title="Remove favorite"
                    >
                        <X size={14} />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-3">
                        <Heart size={13} className="shrink-0 fill-pink-400 text-pink-400" />
                        <span className="truncate text-sm font-semibold text-white">
                            {favorite.destination_name}
                        </span>
                    </div>
                </div>

                <Link
                    href={`/dashboard/plan?destination=${encodeURIComponent(favorite.destination_name)}`}
                    className="flex items-center justify-center gap-1.5 border-t border-white/10 py-2.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-500/10 sm:text-sm"
                >
                    <Sparkles size={13} />
                    Plan a Trip
                </Link>
            </div>

            {/* BAGO — Lightbox modal */}
            <AnimatePresence>
                {lightboxOpen && image && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxOpen(false)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-0 backdrop-blur-sm sm:p-8"
                    >
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-6 sm:top-6 sm:bg-white/10"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative flex h-full w-full items-center justify-center sm:h-auto sm:max-h-[85vh] sm:w-auto sm:max-w-4xl sm:overflow-hidden sm:rounded-2xl"
                        >
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="h-full w-full object-contain sm:h-auto sm:max-h-[85vh]"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-6 pt-10 sm:px-5 sm:pb-4 sm:pt-8">
                                <p className="text-sm font-semibold capitalize text-white">
                                    {favorite.destination_name}
                                </p>
                                <p className="mt-1 flex flex-wrap items-center gap-x-1 text-xs text-slate-300">
                                    <span>Photo by</span>
                                    <a
                                        href={withUtm(image.creditLink)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:text-white hover:underline"
                                    >
                                        {image.credit}
                                    </a>
                                    <span>on</span>
                                    <a
                                        href={withUtm("https://unsplash.com")}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 hover:text-white hover:underline"
                                    >
                                        Unsplash
                                        <ExternalLink size={11} />
                                    </a>
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}