"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AIIntro from "@/components/result/ai-intro";
import ItineraryTimeline from "@/components/result/itinerary-timeline";
import InsightCards from "@/components/result/insight-cards";
import ActionButtons from "@/components/result/action-buttons";
import TripStats from "@/components/result/trip-stats";
import ResultHero from "@/components/result/result-hero";
import DestinationGallery from "@/components/result/destination-gallery";
import BudgetBlocker from "@/components/result/budget-blocker";

import type { TripResult } from "@/types/trip";

type Props = TripResult & {
  destination: string;
  budget: string;
  days: string;
  origin?: string;
  isSavedTrip?: boolean;
  onAdjustBudget?: () => void;
};

export default function ResultCard(props: Props) {
  const { isSavedTrip = false } = props;

  const [step, setStep] = useState(isSavedTrip ? 3 : 0);
  const [proceedAnyway, setProceedAnyway] = useState(isSavedTrip);

  const shouldBlock = !isSavedTrip && !props.budgetFeasible && !proceedAnyway;

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
            destination={props.destination}
            origin={props.origin}
            bestSeason={props.bestSeason}
            budgetFeasible={props.budgetFeasible}
            budgetNote={props.budgetNote}
            flightEstimate={props.flightEstimate}
          />
        </motion.div>
      )}

      {step >= 1 && shouldBlock && (
        <BudgetBlocker
          budgetNote={props.budgetNote}
          recommendedBudget={props.recommendedBudget}
          onAdjustBudget={() => props.onAdjustBudget?.()}
          onGenerateAnyway={() => setProceedAnyway(true)}
        />
      )}

      {!shouldBlock && (
        <>
          <DestinationGallery
            destination={props.destination}
            heroImageQuery={props.heroImageQuery}
            galleryQueries={props.galleryQueries}
            cachedHeroImage={props.heroImage}
            cachedGalleryImages={props.galleryImages}
          />

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
                  budgetFeasible: props.budgetFeasible,
                  budgetNote: props.budgetNote,
                  flightEstimate: props.flightEstimate,
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
        </>
      )}
    </div>
  );
}