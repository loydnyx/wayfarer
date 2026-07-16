"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, LogOut, Moon, Sun } from "lucide-react";
import { signOut } from "@/lib/auth/sign-out";
import { CURRENCIES } from "@/lib/currencies"; // BAGO — shared list
import type { User } from "@supabase/supabase-js";

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

  const isLight = theme === "light";

  if (loading) {
    return (
      <div className="px-4 py-4 sm:p-6 lg:p-10">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-white/5 sm:h-8 sm:w-40" />
        <div className="mt-4 h-56 animate-pulse rounded-2xl border border-white/10 bg-white/5 sm:mt-6 sm:h-64" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-24 sm:p-6 sm:pb-10 lg:p-10">
      <h1 className="text-xl font-bold text-white sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-slate-400 sm:mt-2 sm:text-base">
        Manage your profile and preferences.
      </p>

      {/* Profile section */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:mt-8">
        <div className="h-14 bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-transparent sm:h-16" />

        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="-mt-8 flex items-end gap-3 sm:-mt-10 sm:gap-4">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="h-16 w-16 shrink-0 rounded-full border-4 border-[#050816] sm:h-20 sm:w-20"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[#050816] bg-cyan-500 text-xl font-bold text-black sm:h-20 sm:w-20 sm:text-2xl">
                {user?.email?.[0]?.toUpperCase()}
              </div>
            )}

            <div className="min-w-0 pb-1">
              <p className="truncate text-sm font-semibold text-white sm:text-lg">
                {user?.user_metadata?.full_name || "Traveler"}
              </p>
              <p className="truncate text-xs text-slate-400 sm:text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences section */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:mt-6 sm:p-6">
        <h2 className="text-sm font-semibold text-white sm:text-lg">Preferences</h2>

        <div className="mt-3 space-y-5 sm:mt-5 sm:space-y-6">
          <div>
            <label className="mb-2 block text-xs text-slate-400 sm:text-sm">
              Preferred Currency
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {CURRENCIES.map((c) => {
                const isActive = currency === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    title={c.label}
                    className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                      isActive
                        ? "bg-cyan-500 text-black"
                        : "border border-white/10 text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <span className={isActive ? "text-black" : "text-slate-500"}>
                      {c.symbol}
                    </span>
                    {c.code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme toggle */}
          <div>
            <label className="mb-2 block text-xs text-slate-400 sm:text-sm">Theme</label>
            <button
              type="button"
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-cyan-500/20"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isLight ? "bg-amber-400/20 text-amber-400" : "bg-cyan-500/20 text-cyan-300"
                  }`}
                >
                  {isLight ? <Sun size={16} /> : <Moon size={16} />}
                </div>
                <span className="text-sm font-medium text-white">
                  {isLight ? "Light Mode" : "Dark Mode"}
                </span>
              </div>

              <div
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                  isLight ? "bg-cyan-500" : "bg-slate-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isLight ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
            <p className="mt-2 text-[11px] text-slate-500 sm:text-xs">
              Light theme coming soon — Wayfarer currently runs in dark mode.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 hidden items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-cyan-400 disabled:opacity-50 sm:mt-6 sm:flex sm:w-auto"
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

      {/* Account section */}
      <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 sm:mt-6 sm:p-6">
        <h2 className="text-sm font-semibold text-white sm:text-lg">Account</h2>
        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
          Sign out of your Wayfarer account on this device.
        </p>
        <button
          onClick={signOut}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 sm:mt-4 sm:w-auto sm:justify-start"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Mobile — sticky floating save button */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-white/10 bg-[#050816]/95 px-4 py-3 backdrop-blur-xl sm:hidden">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
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