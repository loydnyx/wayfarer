"use client";

import { useState } from "react";
import { Download, Share2, Check, Plane, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import type { TripResult, TripInput } from "@/types/trip";
import { exportTripToPDF } from "@/lib/export-pdf";
import { saveTrip } from "@/lib/trips/save-trip";
import { setPendingSave } from "@/lib/trips/pending-save";
import { useUser } from "@/hooks/use-user";
import { signInWithGoogle } from "@/lib/auth/sign-in";
import { getAirportCode } from "@/lib/airports";

type Props = {
  trip: TripResult;
  input: TripInput;
  alreadySaved?: boolean;
};

export default function ActionButtons({ trip, input, alreadySaved }: Props) {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(alreadySaved);
  const [saveError, setSaveError] = useState("");
  const [exportingPDF, setExportingPDF] = useState(false);

  // BAGO — alamin agad kung may Skyscanner match, gagamitin sa buong component
  const destCode = getAirportCode(trip.city || input.destination);
  const originCode = input.origin ? getAirportCode(input.origin) : null;
  const hasSkyscannerMatch = !!destCode;

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      await exportTripToPDF(trip, input);
    } catch (err) {
      console.error("Failed to export PDF:", err);
    } finally {
      setExportingPDF(false);
    }
  };

  const handleShare = async () => {
    const shareText = `Check out my ${input.days}-day trip to ${input.destination}, planned by Wayfarer AI!\n\n${trip.summary}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: trip.title, text: shareText });
      } catch (err) {
        // User cancelled or share failed silently
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleCheckGoogleFlights = () => {
    const query = encodeURIComponent(`Flights to ${trip.city || input.destination}`);
    window.open(`https://www.google.com/travel/flights?q=${query}`, "_blank");
  };

  // BAGO — gumagamit ng pre-computed match, laging Skyscanner kung meron
  const handleCheckFlights = () => {
    if (!hasSkyscannerMatch) {
      handleCheckGoogleFlights();
      return;
    }

    if (originCode) {
      window.open(
        `https://www.skyscanner.com/transport/flights/${originCode.toLowerCase()}/${destCode!.toLowerCase()}/`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.skyscanner.com/transport/flights/anywhere/${destCode!.toLowerCase()}/`,
        "_blank"
      );
    }
  };

  const handleSaveTrip = async () => {
    if (!user) {
      setPendingSave(trip, input);
      signInWithGoogle("/dashboard/trips?pending=1");
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      await saveTrip(trip, input);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save trip:", err);
      setSaveError("Failed to save trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveButtonContent = saved ? (
    <>
      <BookmarkCheck size={18} className="text-purple-400" />
      Saved to Your Trips
    </>
  ) : saving ? (
    <>
      <Bookmark size={18} className="animate-pulse" />
      Saving...
    </>
  ) : (
    <>
      <Bookmark size={18} />
      {user ? "Save This Trip" : "Sign In to Save"}
    </>
  );

  const exportButtonContent = exportingPDF ? (
    <>
      <Loader2 className="mr-2 inline animate-spin" size={18} />
      Preparing...
    </>
  ) : (
    <>
      <Download className="mr-2 inline" size={18} />
      Export PDF
    </>
  );

  // BAGO — dynamic label base sa match
  const flightButtonLabel = hasSkyscannerMatch
    ? "Check Flights on Skyscanner"
    : "Check Flights on Google Flights";

  return (
    <>
      {/* Desktop / inline layout */}
      <div className="hidden space-y-4 lg:block">
        <div>
          <button
            onClick={handleCheckFlights}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 text-sm font-medium text-cyan-300 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-cyan-500/20 active:translate-y-0 active:scale-[0.98]"
          >
            <Plane size={18} />
            {flightButtonLabel}
          </button>
          {/* BAGO — conditional, lalabas lang kung Skyscanner ang primary */}
          {hasSkyscannerMatch && (
            <button
              onClick={handleCheckGoogleFlights}
              className="mt-1.5 w-full text-center text-xs text-slate-500 hover:text-slate-300 hover:underline"
            >
              Prefer Google Flights instead?
            </button>
          )}
        </div>

        <button
          onClick={handleSaveTrip}
          disabled={saving || saved}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-purple-500/30 hover:bg-white/10 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saveButtonContent}
        </button>

        {saveError && (
          <p className="text-center text-xs text-red-400">{saveError}</p>
        )}

        <section className="flex gap-4">
          <button
            onClick={handleExportPDF}
            disabled={exportingPDF}
            className="flex-1 rounded-xl bg-cyan-500 py-3 text-sm font-medium text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 active:translate-y-0 active:scale-[0.98] disabled:opacity-70"
          >
            {exportButtonContent}
          </button>

          <button
            onClick={handleShare}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-cyan-500/30 hover:bg-white/10 active:translate-y-0 active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="mr-2 inline text-green-400" size={18} />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="mr-2 inline" size={18} />
                Share
              </>
            )}
          </button>
        </section>
      </div>

      {/* Mobile: secondary actions inline, primary action floats at bottom */}
      <div className="space-y-3 pb-24 lg:hidden">
        <div>
          <button
            onClick={handleCheckFlights}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 text-sm font-medium text-cyan-300 active:scale-[0.98]"
          >
            <Plane size={18} />
            {flightButtonLabel}
          </button>
          {hasSkyscannerMatch && (
            <button
              onClick={handleCheckGoogleFlights}
              className="mt-1.5 w-full text-center text-xs text-slate-500 active:text-slate-300"
            >
              Prefer Google Flights instead?
            </button>
          )}
        </div>

        {saveError && (
          <p className="text-center text-xs text-red-400">{saveError}</p>
        )}

        <section className="flex gap-3">
          <button
            onClick={handleExportPDF}
            disabled={exportingPDF}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white active:scale-[0.98] disabled:opacity-70"
          >
            {exportingPDF ? (
              <>
                <Loader2 className="mr-1.5 inline animate-spin" size={16} />
                Preparing...
              </>
            ) : (
              <>
                <Download className="mr-1.5 inline" size={16} />
                Export
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 inline text-green-400" size={16} />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="mr-1.5 inline" size={16} />
                Share
              </>
            )}
          </button>
        </section>
      </div>

      {/* Floating CTA bar — mobile only */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#050816]/90 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-xl lg:hidden">
        <button
          onClick={handleSaveTrip}
          disabled={saving || saved}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3.5 text-sm font-semibold text-black transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saveButtonContent}
        </button>
      </div>
    </>
  );
}