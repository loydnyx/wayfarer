"use client";

import { createClient } from "@/lib/supabase/client";

export type FavoriteDestination = {
  id: string;
  destination_name: string;
  created_at: string;
};

export async function getFavorites(): Promise<FavoriteDestination[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("favorite_destinations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addFavorite(destinationName: string) {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) throw new Error("You must be signed in to add a favorite.");

  const { data, error } = await supabase
    .from("favorite_destinations")
    .insert({ user_id: user.id, destination_name: destinationName })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("favorite_destinations").delete().eq("id", id);

  if (error) throw error;
}