"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Check,
  LogOut,
  Moon,
  Sun,
  FileText,
  ShieldCheck,
  ChevronRight,
  Download,
  Trash2,
  RefreshCw,
  Bell,
  MapPin,
  Info,
  AlertTriangle,
} from "lucide-react";
import { signOut } from "@/lib/auth/sign-out";
import { CURRENCIES } from "@/lib/currencies";
import { exportUserData } from "@/lib/trips/export-data";
import { clearLocalCache } from "@/lib/clear-local-cache";
import type { User } from "@supabase/supabase-js";

const APP_VERSION = "1.0.0";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState("PHP");
  const [theme, setTheme] = useState("dark");
  const [defaultOrigin, setDefaultOrigin] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [exporting, setExporting] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);

      if (userData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("preferred_currency, preferred_theme, default_origin, email_notifications")
          .eq("id", userData.user.id)
          .single();

        if (profile) {
          setCurrency(profile.preferred_currency || "PHP");
          setTheme(profile.preferred_theme || "dark");
          setDefaultOrigin(profile.default_origin || "");
          setEmailNotifications(profile.email_notifications || false);
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
      .update({
        preferred_currency: currency,
        preferred_theme: theme,
        default_origin: defaultOrigin.trim() || null,
        email_notifications: emailNotifications,
      })
      .eq("id", user.id);

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      await exportUserData(user.id);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleClearCache = () => {
    clearLocalCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;

    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) throw new Error("Failed to delete account");

      window.location.href = "/";
    } catch (err) {
      console.error("Delete account failed:", err);
      setDeleteError("Something went wrong. Please try again or contact support.");
      setDeleting(false);
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

      {/* PREFERENCES */}
      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:mt-8">
        Preferences
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="p-4 sm:p-6">
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

        {/* Default Origin — BAGO */}
        <div className="border-t border-white/10 p-4 sm:p-6">
          <label htmlFor="default-origin" className="mb-2 block text-xs text-slate-400 sm:text-sm">
            Default Departure Location
          </label>
          <div className="relative">
            <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="default-origin"
              value={defaultOrigin}
              onChange={(e) => setDefaultOrigin(e.target.value)}
              placeholder="e.g. Manila, Philippines"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 sm:text-xs">
            Auto-fills the "Flying from" field whenever you plan a new trip.
          </p>
        </div>

        {/* Theme row */}
        <button
          type="button"
          onClick={() => setTheme(isLight ? "dark" : "light")}
          className="flex w-full items-center justify-between border-t border-white/10 px-4 py-3.5 transition-colors hover:bg-white/5 sm:px-6"
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

        <div className="border-t border-white/10 px-4 py-3 sm:px-6">
          <p className="text-[11px] text-slate-500 sm:text-xs">
            Light theme coming soon — Wayfarer currently runs in dark mode.
          </p>
        </div>

        {/* Notification Preferences — BAGO */}
        <button
          type="button"
          onClick={() => setEmailNotifications((prev) => !prev)}
          className="flex w-full items-center justify-between border-t border-white/10 px-4 py-3.5 transition-colors hover:bg-white/5 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">
              <Bell size={16} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-medium text-white">Email Notifications</span>
              <span className="block text-[11px] text-slate-500">Coming soon</span>
            </div>
          </div>

          <div
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
              emailNotifications ? "bg-cyan-500" : "bg-slate-600"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                emailNotifications ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </button>

        <div className="border-t border-white/10 p-4 sm:p-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-cyan-400 disabled:opacity-50 sm:w-auto"
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

      {/* LEGAL */}
      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:mt-8">
        Legal
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <Link
          href="/terms"
          className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-white/5 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300">
              <FileText size={16} />
            </div>
            <span className="text-sm font-medium text-white">Terms of Use</span>
          </div>
          <ChevronRight size={16} className="text-slate-500" />
        </Link>

        <Link
          href="/privacy"
          className="flex items-center justify-between border-t border-white/10 px-4 py-3.5 transition-colors hover:bg-white/5 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300">
              <ShieldCheck size={16} />
            </div>
            <span className="text-sm font-medium text-white">Privacy Policy</span>
          </div>
          <ChevronRight size={16} className="text-slate-500" />
        </Link>
      </div>

      {/* DATA & PRIVACY — BAGO */}
      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:mt-8">
        Data &amp; Privacy
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-white/5 disabled:opacity-50 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300">
              <Download size={16} />
            </div>
            <div>
              <span className="block text-sm font-medium text-white">Export My Data</span>
              <span className="block text-[11px] text-slate-500">
                Download your trips and favorites as a file
              </span>
            </div>
          </div>
          <span className="shrink-0 text-xs text-slate-500">
            {exporting ? "Preparing..." : ""}
          </span>
        </button>

        <button
          onClick={handleClearCache}
          className="flex w-full items-center justify-between border-t border-white/10 px-4 py-3.5 text-left transition-colors hover:bg-white/5 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300">
              <RefreshCw size={16} />
            </div>
            <div>
              <span className="block text-sm font-medium text-white">Clear Local Cache</span>
              <span className="block text-[11px] text-slate-500">
                Clear temporary data stored on this device
              </span>
            </div>
          </div>
          {cacheCleared && (
            <span className="flex shrink-0 items-center gap-1 text-xs text-green-400">
              <Check size={12} />
              Cleared
            </span>
          )}
        </button>
      </div>

      {/* ACCOUNT */}
      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:mt-8">
        Account
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {/* Connected account — BAGO */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300">
              <svg viewBox="0 0 24 24" width="15" height="15">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <div>
              <span className="block text-sm font-medium text-white">Connected Account</span>
              <span className="block text-[11px] text-slate-500">Signed in with Google</span>
            </div>
          </div>
        </div>

        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 border-t border-white/10 px-4 py-3.5 text-left transition-colors hover:bg-white/5 sm:px-6"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300">
            <LogOut size={16} />
          </div>
          <span className="text-sm font-medium text-white">Sign Out</span>
        </button>

        {/* Delete Account — BAGO */}
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="flex w-full items-center gap-3 border-t border-white/10 px-4 py-3.5 text-left transition-colors hover:bg-red-500/5 sm:px-6"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <Trash2 size={16} />
          </div>
          <span className="text-sm font-medium text-red-400">Delete Account</span>
        </button>
      </div>

      {/* ABOUT — BAGO */}
      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:mt-8">
        About
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300">
            <Info size={16} />
          </div>
          <div>
            <span className="block text-sm font-medium text-white">Wayfarer</span>
            <span className="block text-[11px] text-slate-500">Version {APP_VERSION}</span>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal — BAGO */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-[#0a0f1f] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle size={22} className="text-red-400" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-white">Delete your account?</h2>
            <p className="mt-2 text-sm text-slate-400">
              This will permanently delete your account, saved trips, and favorites. This cannot
              be undone.
            </p>

            <label className="mt-4 block text-xs text-slate-400">
              Type <span className="font-semibold text-white">DELETE</span> to confirm
            </label>
            <input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-red-400"
            />

            {deleteError && (
              <p className="mt-2 text-xs text-red-400">{deleteError}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteConfirmText("");
                  setDeleteError("");
                }}
                disabled={deleting}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || deleting}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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