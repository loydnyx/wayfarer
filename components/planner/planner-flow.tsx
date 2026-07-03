"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlannerForm from "./planner-form";
import { Button } from "@/components/ui/button";
import type { TripInput, TripResult } from "@/types/trip";
import AIConsole from "../ai/ai-console";

export default function PlannerFlow() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "thinking" | "error">("idle");
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

      // Save to sessionStorage and navigate to the result page
      sessionStorage.setItem("atlas_trip_result", JSON.stringify(parsed));
      sessionStorage.setItem("atlas_trip_input", JSON.stringify(data));

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

      {state === "thinking" && <AIConsole />}

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