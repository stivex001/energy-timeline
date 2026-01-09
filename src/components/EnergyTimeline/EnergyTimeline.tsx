import { BiRun } from "react-icons/bi";
import { IoTrendingUp } from "react-icons/io5";

import { getFocusState } from "../../utils/focusState";
import { energyData, highlights, customMessage } from "../../data/sampleData";
import { EnergyChart } from "./EnergyChart";
import { RecommendationText } from "./RecommendationText";
import { SleepInfoCards } from "./SleepInfoCards";
import { useEnergyInsights } from "../../hooks/useEnergyInsights";
import { useRealTime } from "../../hooks/useRealTime";

export const EnergyTimeline = () => {
  // Get real-time current time that updates every minute
  const realTime = useRealTime(60000); // Update every 60 seconds

  const { currentPhase, currentEnergyLevel } = useEnergyInsights({
    data: energyData,
    highlights,
    currentTime: realTime,
  });

  return (
    <div className="w-full max-w-5xl rounded-xl bg-linear-to-b from-[#101929] to-[#08090d] flex flex-col max-h-[90vh] overflow-hidden">
      <div className="sticky top-0 z-10 bg-linear-to-b from-[#101929] to-[#101929]/95 backdrop-blur-sm p-6 mb-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base text-white font-semibold">
            Energy Insights
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-sm text-white hover:text-blue-300 transition-colors flex items-center gap-2">
              <BiRun className="text-white" />
              <span>Add activity</span>
            </button>
            <button className="text-sm text-[#788089] hover:text-white cursor-pointer transition-colors">
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 hide-scrollbar">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-400 font-medium mb-3">
              Today's Energy Rhythm
            </h3>
            <p className="text-base text-[#f0efed]">{`Your energy level is ${getFocusState(
              currentEnergyLevel
            )} right now as you are in your ${currentPhase?.label}.`}</p>
            <p className="text-sm text-white opacity-80">
              {customMessage.description}
            </p>
          </div>
          {currentPhase && (
            <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 whitespace-nowrap">
              <IoTrendingUp />
              <span>
                {currentPhase.label} • {getFocusState(currentEnergyLevel)}
              </span>
            </span>
          )}
        </div>

        <div className="mb-6">
          <EnergyChart data={energyData} highlights={highlights} />
        </div>

        <RecommendationText />
        <SleepInfoCards />
      </div>
    </div>
  );
};
