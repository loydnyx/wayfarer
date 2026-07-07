"use client";

import { useEffect, useState } from "react";
import { Heart, X, Plus } from "lucide-react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  type FavoriteDestination,
} from "@/lib/trips/favorites";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDestination, setNewDestination] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch((err) => console.error("Failed to load favorites:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newDestination.trim()) return;

    setAdding(true);
    try {
      const favorite = await addFavorite(newDestination.trim());
      setFavorites((prev) => [favorite, ...prev]);
      setNewDestination("");
    } catch (err) {
      console.error("Failed to add favorite:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-white">Favorites</h1>
      <p className="mt-2 text-slate-400">
        Destinations you're dreaming about for your next adventure.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
        <input
          value={newDestination}
          onChange={(e) => setNewDestination(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a destination, e.g. Kyoto, Japan"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-cyan-400 sm:flex-1"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newDestination.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-cyan-400 disabled:opacity-50 sm:w-auto"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <Heart size={40} className="text-slate-600" />
          <p className="text-slate-400">No favorite destinations yet.</p>
          <p className="text-sm text-slate-500">Add places you'd love to visit someday.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-pink-400" />
                <span className="text-sm text-white">{fav.destination_name}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(fav.id)}
                className="text-slate-500 transition-colors hover:text-red-400"
                title="Remove favorite"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}