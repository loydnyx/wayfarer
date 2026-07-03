import AnimatedBackground from "@/components/common/animated-background";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/hero/hero";
import Features from "@/components/home/features";
import WhyAtlas from "@/components/home/why-atlas";
import HowItWorks from "@/components/home/how-it-works";
import Pricing from "@/components/home/pricing";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050816]">
      <AnimatedBackground />

      <Navbar />

      <Hero />
      <Features />
      <WhyAtlas />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}