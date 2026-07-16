"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImageIcon, X, ExternalLink } from "lucide-react";

type UnsplashImage = {
  id?: string;
  url: string;
  thumbUrl: string;
  alt: string;
  credit: string;
  creditLink: string;
  downloadLocation?: string | null;
};

type Props = {
  destination?: string;
  heroImageQuery?: string;
  galleryQueries?: string[] | null;
  cachedHeroImage?: UnsplashImage | null;
  cachedGalleryImages?: (UnsplashImage | null)[];
};

// BAGO — UTM params required ng Unsplash API guidelines
function withUtm(url: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}utm_source=wayfarer&utm_medium=referral`;
}

export default function DestinationGallery({
  destination,
  heroImageQuery,
  galleryQueries,
  cachedHeroImage,
  cachedGalleryImages,
}: Props) {
  const safeGalleryQueries = galleryQueries ?? [];

  const [heroImage, setHeroImage] = useState<UnsplashImage | null>(
    cachedHeroImage ?? null
  );
  const [heroLoading, setHeroLoading] = useState(!cachedHeroImage);

  const [galleryImages, setGalleryImages] = useState<(UnsplashImage | null)[]>(
    cachedGalleryImages ?? safeGalleryQueries.map(() => null)
  );
  const [galleryLoading, setGalleryLoading] = useState(!cachedGalleryImages);

  const [lightboxImage, setLightboxImage] = useState<{
    image: UnsplashImage;
    caption: string;
  } | null>(null);

  // BAGO — guard laban sa duplicate tracking calls
  const trackedIds = useRef<Set<string>>(new Set());

  // BAGO — i-trigger ang Unsplash download event
  function trackDownload(image?: UnsplashImage | null) {
    if (!image?.downloadLocation || !image.id) return;
    if (trackedIds.current.has(image.id)) return;
    trackedIds.current.add(image.id);

    fetch("/api/images/track-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ downloadLocation: image.downloadLocation }),
    }).catch(() => {});
  }

  useEffect(() => {
    if (cachedHeroImage !== undefined) {
      const img = cachedHeroImage ?? null;
      setHeroImage(img);
      setHeroLoading(false);
      trackDownload(img);
      return;
    }

    if (!heroImageQuery) {
      setHeroLoading(false);
      return;
    }

    setHeroLoading(true);
    const fallback = destination ? `&fallback=${encodeURIComponent(destination)}` : "";
    fetch(`/api/images?query=${encodeURIComponent(heroImageQuery)}&count=1${fallback}&offset=0`)
      .then((res) => res.json())
      .then((data) => {
        const img = data.images?.[0] ?? null;
        setHeroImage(img);
        trackDownload(img);
      })
      .catch(() => setHeroImage(null))
      .finally(() => setHeroLoading(false));
  }, [heroImageQuery, destination, cachedHeroImage]);

  useEffect(() => {
    if (cachedGalleryImages !== undefined) {
      const imgs = cachedGalleryImages ?? safeGalleryQueries.map(() => null);
      setGalleryImages(imgs);
      setGalleryLoading(false);
      imgs.forEach(trackDownload);
      return;
    }

    if (safeGalleryQueries.length === 0) {
      setGalleryLoading(false);
      return;
    }

    setGalleryLoading(true);
    const fallback = destination ? `&fallback=${encodeURIComponent(destination)}` : "";

    Promise.all(
      safeGalleryQueries.map((q, index) =>
        fetch(`/api/images?query=${encodeURIComponent(q)}&count=1${fallback}&offset=${index + 1}`)
          .then((res) => res.json())
          .then((data) => data.images?.[0] ?? null)
          .catch(() => null)
      )
    )
      .then((imgs) => {
        setGalleryImages(imgs);
        imgs.forEach(trackDownload);
      })
      .finally(() => setGalleryLoading(false));
  }, [safeGalleryQueries, destination, cachedGalleryImages]);

  useEffect(() => {
    if (!lightboxImage) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxImage]);

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2">
        <Camera className="text-cyan-400" size={18} />
        <h2 className="text-xl font-semibold">Destination Gallery</h2>
      </div>

      {/* Hero */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.25 }}
        onClick={() =>
          heroImage &&
          setLightboxImage({ image: heroImage, caption: destination || "" })
        }
        className={`relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-black ${
          heroImage ? "cursor-zoom-in" : ""
        }`}
      >
        {heroLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          </div>
        ) : heroImage ? (
          <>
            <img
              src={heroImage.url}
              alt={heroImage.alt}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <h3 className="text-2xl font-bold text-white">{destination}</h3>
              {/* BAGO — hiwalay na links, may UTM */}
              <p className="text-xs text-slate-300">
                Photo by{" "}
                <a
                  href={withUtm(heroImage.creditLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:underline"
                >
                  {heroImage.credit}
                </a>{" "}
                on{" "}
                <a
                  href={withUtm("https://unsplash.com")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:underline"
                >
                  Unsplash
                </a>
              </p>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ImageIcon className="mb-4 text-cyan-400" size={48} />
            <h3 className="text-2xl font-bold">{destination}</h3>
            <p className="mt-2 text-slate-400">No image found</p>
          </div>
        )}
      </motion.div>

      {/* Gallery */}
      <div className="grid grid-cols-2 gap-4">
        {safeGalleryQueries.map((query, index) => {
          const image = galleryImages[index];

          return (
            <motion.div
              key={query + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => image && setLightboxImage({ image, caption: query })}
              className={`relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl ${
                image ? "cursor-zoom-in" : ""
              }`}
            >
              {galleryLoading ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                </div>
              ) : image ? (
                <>
                  <img
                    src={image.thumbUrl}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3">
                    <p className="text-xs font-medium capitalize text-white">
                      {query}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <ImageIcon className="mb-3 text-cyan-400" size={28} />
                  <p className="text-sm font-medium capitalize">{query}</p>
                  <span className="mt-1 text-xs text-slate-500">
                    No image found
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

{/* Lightbox modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-0 backdrop-blur-sm sm:p-8"
          >
            <button
              onClick={() => setLightboxImage(null)}
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
                src={lightboxImage.image.url}
                alt={lightboxImage.image.alt}
                className="h-full w-full object-contain sm:h-auto sm:max-h-[85vh]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-6 pt-10 sm:px-5 sm:pb-4 sm:pt-8">
                <p className="text-sm font-semibold capitalize text-white sm:text-sm sm:font-medium">
                  {lightboxImage.caption}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-1 text-xs text-slate-300 sm:mt-0">
                  <span>Photo by</span>
                  <a
                    href={withUtm(lightboxImage.image.creditLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-white hover:underline"
                  >
                    {lightboxImage.image.credit}
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
    </section>
  );
}