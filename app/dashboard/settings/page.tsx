"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const CURRENCIES = ["PHP", "USD", "EUR", "GBP", "JPY"];
const THEMES = ["dark", "light"];

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState("PHP");
  const [theme, setTheme] = useState("dark");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);

      if (userData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("preferred_currency, preferred_theme")
          .eq("id", userData.user.id)
          .single();

        if (profile) {
          setCurrency(profile.preferred_currency || "PHP");
          setTheme(profile.preferred_theme || "dark");
        }
      }
      setLoading(false);
    }

    load();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ preferred_currency: currency, preferred_theme: theme })
      .eq("id", user.id);

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-white/5" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <p className="mt-2 text-slate-400">Manage your profile and preferences.</p>

      {/* Profile section */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Profile</h2>

        <div className="mt-5 flex items-center gap-4">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-xl font-bold text-black">
              {user?.email?.[0]?.toUpperCase()}
            </div>
          )}

          <div>
            <p className="font-medium text-white">
              {user?.user_metadata?.full_name || "Traveler"}
            </p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Preferences section */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Preferences</h2>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Preferred Currency
            </label>
            <div className="flex flex-wrap gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    currency === c
                      ? "bg-cyan-500 text-black"
                      : "border border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">Theme</label>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`rounded-full px-4 py-2 text-sm capitalize transition-colors ${
                    theme === t
                      ? "bg-cyan-500 text-black"
                      : "border border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Light theme coming soon — Wayfarer currently runs in dark mode.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check size={16} />
              Saved!
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}