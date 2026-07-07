"use client";

import { useEffect } from "react";
import { getPendingSave, clearPendingSave } from "@/lib/trips/pending-save";
import { saveTrip } from "@/lib/trips/save-trip";

export default function PendingSaveHandler() {
  useEffect(() => {
    const pending = getPendingSave();
    if (!pending) return;

    saveTrip(pending.trip, pending.input)
      .then(() => clearPendingSave())
      .catch((err) => console.error("Failed to save pending trip:", err));
  }, []);

  return null;
}