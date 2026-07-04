import { createClient } from "@/lib/supabase/server";

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-white">Welcome back, {firstName} 👋</h1>
      <p className="mt-2 text-slate-400">
        Here's a quick look at your travel planning activity.
      </p>
    </div>
  );
}