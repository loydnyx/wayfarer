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
  isSavedTrip?: boolean; // BAGO
};

export default function ResultCard(props: Props) {
  const { isSavedTrip = false } = props;

  // Kung saved trip na, simulan agad sa step 3 (lahat done na, walang typing)
  const [step, setStep] = useState(isSavedTrip ? 3 : 0);

  return (
    <div className="space-y-10">
      <ResultHero title={props.title} destination={props.destination} />

      <AIIntro
        summary={props.summary}
        isActive={!isSavedTrip && step === 0}
        isDone={isSavedTrip || step > 0}
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
        isActive={!isSavedTrip && step === 1}
        isDone={isSavedTrip || step > 1}
        onComplete={() => setStep(2)}
      />

      <InsightCards
        tips={props.tips}
        isActive={!isSavedTrip && step === 2}
        isDone={isSavedTrip || step > 2}
        onComplete={() => setStep(3)}
      />

      {step >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ActionButtons
            trip={{
              title: props.title,
              summary: props.summary,
              country: props.country,
              city: props.city,
              coordinates: props.coordinates,
              bestSeason: props.bestSeason,
              estimatedDailyBudget: props.estimatedDailyBudget,
              heroImageQuery: props.heroImageQuery,
              galleryQueries: props.galleryQueries,
              itinerary: props.itinerary,
              tips: props.tips,
            }}
            input={{
              destination: props.destination,
              budget: props.budget,
              days: props.days,
            }}
            alreadySaved={isSavedTrip}
          />
        </motion.div>
      )}
    </div>
  );
}