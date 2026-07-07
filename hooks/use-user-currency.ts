"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUserCurrency() {
  const [currencyCode, setCurrencyCode] = useState("PHP");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("preferred_currency")
          .eq("id", userData.user.id)
          .single();

        if (profile?.preferred_currency) {
          setCurrencyCode(profile.preferred_currency);
        }
      }

      setLoading(false);
    }

    load();
  }, []);

  return { currencyCode, loading };
}