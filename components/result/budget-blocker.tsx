"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, ArrowLeft, Wallet } from "lucide-react";

type Props = {
  budgetNote: string;
  recommendedBudget?: string;
  expectedCurrency?: string; // BAGO — hal. "USD", "PHP"
  onAdjustBudget: () => void;
  onGenerateAnyway: () => void;
};

export default function BudgetBlocker({
  budgetNote,
  recommendedBudget,
  expectedCurrency,
  onAdjustBudget,
  onGenerateAnyway,
}: Props) {
  // BAGO — huwag ipakita kung mali ang currency (mas ligtas kaysa magpakita ng mali)
  const showRecommended =
    recommendedBudget &&
    (!expectedCurrency ||
      recommendedBudget.toUpperCase().includes(expectedCurrency.toUpperCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
          <AlertTriangle size={28} className="text-amber-400" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-white sm:text-2xl">
          Your budget looks too tight
        </h2>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
          {budgetNote ||
            "Based on typical costs for this destination, your current budget may not be enough to cover accommodation, food, and activities."}
        </p>

        {showRecommended && (
          <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3">
            <Wallet size={18} className="text-cyan-300" />
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-wide text-cyan-300/70">
                Recommended Minimum
              </p>
              <p className="text-lg font-bold text-cyan-300">{recommendedBudget}</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            onClick={onAdjustBudget}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-400 active:translate-y-0 active:scale-[0.98]"
          >
            <ArrowLeft size={16} />
            Adjust Budget
          </button>

          <button
            onClick={onGenerateAnyway}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/30 hover:bg-white/10 active:translate-y-0 active:scale-[0.98]"
          >
            <Sparkles size={16} />
            Generate Anyway
          </button>
        </div>
      </div>
    </motion.div>
  );
}