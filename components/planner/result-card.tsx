"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AIIntro from "@/components/result/ai-intro";
import ItineraryTimeline from "@/components/result/itinerary-timeline";
import InsightCards from "@/components/result/insight-cards";
import ActionButtons from "@/components/result/action-buttons";
import TripStats from "@/components/result/trip-stats";
import ResultHero from "@/components/result/result-hero";

import type { TripResult } from "@/types/trip";

type Props = TripResult & {
  destination: string;
  budget: string;
  days: string;
};

export default function ResultCard(props: Props) {
  // 0 = summary typing, 1 = itinerary typing, 2 = insights typing, 3 = all done
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-10">
      <ResultHero title={props.title} destination={props.destination} />

      <AIIntro
        summary={props.summary}
        isActive={step === 0}
        isDone={step > 0}
        onComplete={() => setStep(1)}
      />

      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <TripStats
            budget={props.budget}
            days={props.days}
            country={props.country}
          />
        </motion.div>
      )}

      <ItineraryTimeline
        itinerary={props.itinerary}
        isActive={step === 1}
        isDone={step > 1}
        onComplete={() => setStep(2)}
      />

      <InsightCards
        tips={props.tips}
        isActive={step === 2}
        isDone={step > 2}
        onComplete={() => setStep(3)}
      />

      {step >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ActionButtons />
        </motion.div>
      )}
    </div>
  );
}