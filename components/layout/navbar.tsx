export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="section flex h-16 items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          Wayfarer
        </h1>

        <nav className="hidden md:flex gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>

        <button className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium hover:bg-blue-400 transition">
          Get Started
        </button>
      </div>
    </header>
  );
}