import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AnimatedBackground from "@/components/common/animated-background";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/hero/hero";
import Features from "@/components/home/features";
import WhyWayfarer from "@/components/home/why-wayfarer";
import HowItWorks from "@/components/home/how-it-works";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050816]">
      <AnimatedBackground />

      <Navbar />

      <Hero />
      <Features />
      <WhyWayfarer />
      <HowItWorks />
      <Footer />
    </main>
  );
}