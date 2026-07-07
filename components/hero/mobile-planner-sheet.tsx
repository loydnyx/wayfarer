"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PlannerFlow from "@/components/planner/planner-flow";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobilePlannerSheet({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm lg:hidden"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-x-0 bottom-0 z-[95] max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#0a0e1a] pb-[env(safe-area-inset-bottom)] lg:hidden"
          >
            {/* Drag handle */}
            <div className="sticky top-0 z-10 flex justify-center bg-[#0a0e1a] pt-3">
              <div className="h-1.5 w-10 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center justify-between px-5 pb-2 pt-3">
              <h3 className="text-lg font-semibold text-white">Plan Your Trip</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-5 pb-8">
              <PlannerFlow />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}