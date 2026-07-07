"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/sign-out";
import type { User } from "@supabase/supabase-js";

const CURRENCIES = ["PHP", "USD", "EUR", "GBP", "JPY"];

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
        <div className="px-4 py-4 sm:p-6 lg:p-10">
            <h1 className="text-xl font-bold text-white sm:text-3xl">Settings</h1>
            <p className="mt-1 text-sm text-slate-400 sm:mt-2 sm:text-base">
                Manage your profile and preferences.
            </p>

            {/* Profile section */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:mt-8 sm:p-6">
                <h2 className="text-sm font-semibold text-white sm:text-lg">Profile</h2>

                <div className="mt-3 flex items-center gap-3 sm:mt-5 sm:gap-4">
                    {user?.user_metadata?.avatar_url ? (
                        <img
                            src={user.user_metadata.avatar_url}
                            alt="Avatar"
                            className="h-12 w-12 rounded-full sm:h-16 sm:w-16"
                        />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-lg font-bold text-black sm:h-16 sm:w-16 sm:text-xl">
                            {user?.email?.[0]?.toUpperCase()}
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium text-white sm:text-base">
                            {user?.user_metadata?.full_name || "Traveler"}
                        </p>
                        <p className="text-xs text-slate-400 sm:text-sm">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Preferences section */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:mt-6 sm:p-6">
                <h2 className="text-sm font-semibold text-white sm:text-lg">Preferences</h2>

                <div className="mt-3 space-y-4 sm:mt-5 sm:space-y-5">
                    <div>
                        <label className="mb-2 block text-xs text-slate-400 sm:text-sm">
                            Preferred Currency
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CURRENCIES.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    className={`rounded-full px-3 py-1.5 text-xs transition-colors sm:px-4 sm:py-2 sm:text-sm ${currency === c
                                            ? "bg-cyan-500 text-black"
                                            : "border border-white/10 text-slate-300 hover:bg-white/5"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Native-feeling slide switch for theme */}
                    <div>
                        <label className="mb-2 block text-xs text-slate-400 sm:text-sm">Theme</label>
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                            <span className="text-sm text-white">
                                {isLight ? "Light Mode" : "Dark Mode"}
                            </span>
                            <button
                                type="button"
                                onClick={() => setTheme(isLight ? "dark" : "light")}
                                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${isLight ? "bg-cyan-500" : "bg-slate-600"
                                    }`}
                                aria-label="Toggle theme"
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${isLight ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500 sm:text-xs">
                            Light theme coming soon — Wayfarer currently runs in dark mode.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-cyan-400 disabled:opacity-50 sm:mt-6 sm:w-auto"
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
        </div>
    );
}