"use client";

import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/use-user";
import { signInWithGoogle } from "@/lib/auth/sign-in";
import { signOut } from "@/lib/auth/sign-out";
import { link } from "fs/promises";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, loading } = useUser();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="section flex h-16 items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Wayfarer</h1>

        <nav className="hidden md:flex gap-8 text-sm text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                console.log("clicked:", link.label);
                setMenuOpen(false);
              }}
              className="rounded-lg px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition-colors hover:border-cyan-500/30"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="h-7 w-7 rounded-full"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-black">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-slate-300">
                      {user.user_metadata?.full_name?.split(" ")[0] || "Account"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl"
                      >
                        <button
                          onClick={signOut}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="hidden rounded-full bg-blue-500 px-5 py-2 text-sm font-medium transition hover:bg-blue-400 sm:block"
                >
                  Sign In
                </button>
              )}
            </>
          )}

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate-300 transition-colors hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl md:hidden"
          >
            <nav className="section flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    setTimeout(() => {
                      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                    }, 300);
                  }}
                  className="rounded-lg px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}

              {user ? (
                <button
                  onClick={signOut}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="mt-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
                >
                  Sign In
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}