import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Tanggalin muna ang related data (walang cascade na naka-set up sa mga table natin)
  await admin.from("saved_trips").delete().eq("user_id", user.id);
  await admin.from("favorite_destinations").delete().eq("user_id", user.id);
  await admin.from("profiles").delete().eq("id", user.id);

  // Tanggalin ang aktwal na auth account
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}