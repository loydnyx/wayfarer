import type { TripResult, TripInput } from "@/types/trip";

const KEY = "wayfarer_pending_save";

export function setPendingSave(trip: TripResult, input: TripInput) {
  sessionStorage.setItem(KEY, JSON.stringify({ trip, input }));
}

export function getPendingSave(): { trip: TripResult; input: TripInput } | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingSave() {
  sessionStorage.removeItem(KEY);
}