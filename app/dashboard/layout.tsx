import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/sidebar";
import MobileNav from "@/components/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#050816]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}