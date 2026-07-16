import PlannerFlow from "@/components/planner/planner-flow";

export default function PlanPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:p-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Plan a New Trip
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Tell Atlas AI where you want to go, and let it build your perfect itinerary.
          </p>
        </div>

        <PlannerFlow />
      </div>
    </div>
  );
}