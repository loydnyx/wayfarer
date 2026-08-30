"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import PlannerForm from "./planner-form";
import { Button } from "@/components/ui/button";
import type { TripInput, TripResult } from "@/types/trip";
import AIConsole from "../ai/ai-console";
import { signInWithGoogle } from "@/lib/auth/sign-in"; // BAGO
import { LogIn } from "lucide-react"; // BAGO

export default function PlannerFlow() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "thinking" | "error" | "auth-required">("idle"); // BAGO
  const [formInput, setFormInput] = useState<TripInput | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerate = async (data: TripInput) => {
    setFormInput(data);
    setState("thinking");
    setErrorMessage("");

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // BAGO — hawakan ang "kailangan mag sign in" na response
      if (res.status === 401) {
        const errData = await res.json().catch(() => null);
        if (errData?.error === "SIGN_IN_REQUIRED") {
          setState("auth-required");
          return;
        }
      }

      const text = await res.text();

      if (!text) {
        throw new Error("Empty response from server");
      }

      let parsed: TripResult;

      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.error("Raw AI response:", text);
        throw new Error("AI returned invalid JSON");
      }

      if (!res.ok) {
        throw new Error((parsed as any)?.error || "Failed to generate trip");
      }

      sessionStorage.setItem("atlas_trip_result", JSON.stringify(parsed));
      sessionStorage.setItem("atlas_trip_input", JSON.stringify(data));
      sessionStorage.setItem("atlas_trip_saved", "false");

      router.push("/trip");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Something went wrong while generating your trip. Please try again."
      );
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setFormInput(null);
    setErrorMessage("");
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {state === "idle" && <PlannerForm onGenerate={handleGenerate} />}

      {/* Desktop: inline thinking state */}
      {state === "thinking" && (
        <div className="hidden lg:block">
          <AIConsole />
        </div>
      )}

      {/* Mobile: full-screen immersive loader overlay */}
      <AnimatePresence>
        {state === "thinking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex h-screen w-full items-center justify-center overflow-hidden bg-[#050816]/95 backdrop-blur-md px-5 lg:hidden"
          >
            <div className="w-full max-w-sm">
              <AIConsole />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BAGO — Sign-in required state */}
      {state === "auth-required" && (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10">
            <LogIn size={22} className="text-cyan-300" />
          </div>
          <div>
            <p className="font-medium text-white">You've used your free trip</p>
            <p className="mt-1 text-sm text-slate-400">
              Sign in with Google to keep planning trips — free, takes a few seconds.
            </p>
          </div>
          <Button onClick={() => signInWithGoogle("/")}>
            Sign in with Google
          </Button>
          <button
            onClick={handleReset}
            className="block mx-auto text-sm text-slate-500 hover:text-slate-300 underline"
          >
            Cancel
          </button>
        </div>
      )}

      {state === "error" && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center space-y-4">
          <p className="text-red-400 font-medium">⚠️ Generation Failed</p>
          <p className="text-sm text-slate-400">{errorMessage}</p>
          <Button onClick={() => formInput && handleGenerate(formInput)}>
            Try Again
          </Button>
          <button
            onClick={handleReset}
            className="block mx-auto text-sm text-slate-500 hover:text-slate-300 underline"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}