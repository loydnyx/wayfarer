"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Plus } from "lucide-react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/lib/trips/favorites";
import { POPULAR_DESTINATIONS } from "@/lib/destinations";
import { getOrFetchDestinationImage } from "@/lib/trips/image-cache.ts"; // BAGO
import FavoritesCarousel, {
  type FavoriteWithImage,
} from "@/components/dashboard/favorites-carousel";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDestination, setNewDestination] = useState("");
  const [adding, setAdding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFavorites()
      .then(async (data) => {
        const withPlaceholders: FavoriteWithImage[] = data.map((f) => ({
          ...f,
          image: null,
          imageLoading: true,
        }));
        setFavorites(withPlaceholders);
        setLoading(false);

        data.forEach(async (fav) => {
          const image = await getOrFetchDestinationImage(fav.destination_name); // BAGO
          setFavorites((prev) =>
            prev.map((f) =>
              f.id === fav.id ? { ...f, image, imageLoading: false } : f
            )
          );
        });
      })
      .catch((err) => {
        console.error("Failed to load favorites:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions =
    newDestination.trim().length > 0
      ? POPULAR_DESTINATIONS.filter(
          (d) =>
            d.toLowerCase().includes(newDestination.toLowerCase()) &&
            !favorites.some(
              (f) => f.destination_name.toLowerCase() === d.toLowerCase()
            )
        ).slice(0, 6)
      : [];

  const handleAdd = async (destinationOverride?: string) => {
    const destination = (destinationOverride ?? newDestination).trim();
    if (!destination) return;

    setAdding(true);
    setShowSuggestions(false);
    try {
      const favorite = await addFavorite(destination);
      setFavorites((prev) => [
        { ...favorite, image: null, imageLoading: true },
        ...prev,
      ]);
      setNewDestination("");

      const image = await getOrFetchDestinationImage(favorite.destination_name); // BAGO
      setFavorites((prev) =>
        prev.map((f) =>
          f.id === favorite.id ? { ...f, image, imageLoading: false } : f
        )
      );
    } catch (err) {
      console.error("Failed to add favorite:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    // Tanggalin lang sa favorites — HINDI natin ginagalaw ang cached image,
    // mananatili ito para sa susunod na gamit.
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    try {
      await removeFavorite(id);
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  return (
    <div className="px-4 py-4 sm:p-6 lg:p-10">
      <h1 className="text-xl font-bold text-text sm:text-3xl">Favorites</h1>
      <p className="mt-1 text-sm text-muted sm:mt-2 sm:text-base">
        Destinations you're dreaming about for your next adventure.
      </p>

      <div className="relative mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row" ref={wrapperRef}>
        <div className="relative w-full sm:flex-1">
          <input
            value={newDestination}
            onChange={(e) => {
              setNewDestination(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a destination, e.g. Kyoto, Japan"
            autoComplete="off"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-text outline-none focus:border-cyan-400"
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="custom-scrollbar absolute z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-border bg-slate-900 shadow-2xl">
              {filteredSuggestions.map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => handleAdd(place)}
                  className="block w-full px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-pink-500/10 hover:text-pink-300"
                >
                  {place}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => handleAdd()}
          disabled={adding || !newDestination.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-cyan-400 disabled:opacity-50 sm:w-auto"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {loading ? (
        <div className="mt-6 h-64 animate-pulse rounded-3xl border border-border bg-surface sm:mt-8 sm:h-80" />
      ) : favorites.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <Heart size={40} className="text-slate-500 dark:text-slate-600" />
          <p className="text-muted">No favorite destinations yet.</p>
          <p className="text-sm text-slate-500">Add places you'd love to visit someday.</p>
        </div>
      ) : (
        <div className="mt-6 sm:mt-8">
          <FavoritesCarousel items={favorites} onRemove={handleRemove} />
        </div>
      )}
    </div>
  );
}