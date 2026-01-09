import { useMemo } from "react";

import { getFocusState } from "./utils";
import { energyData, highlights, currentTime } from "../../data/sampleData";
import { EnergyChartNew } from "./EnergyChartNew";
import { RecommendationText } from "./RecommendationText";
import { SleepInfoCards } from "./SleepInfoCards";

export const EnergyTimeline = () => {
  const data = energyData;

  const parsedData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      date: new Date(d.time),
    }));
  }, [data]);

  const currentTimeDate = useMemo(() => new Date(currentTime), [currentTime]);

  // Process highlights with positions for current phase detection
  const highlightsWithPositions = useMemo(() => {
    // We need to calculate positions similar to the chart, but simplified
    // This is just for finding the current phase
    const startTime = parsedData[0]?.date;
    const endTime = parsedData[parsedData.length - 1]?.date;
    if (!startTime || !endTime) return [];

    return highlights.map((highlight) => ({
      ...highlight,
      date: new Date(highlight.time),
    }));
  }, [highlights, parsedData]);

  // Find current phase from highlights
  const currentPhase = useMemo(() => {
    const sortedHighlights = [...highlightsWithPositions].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    for (let i = 0; i < sortedHighlights.length - 1; i++) {
      if (
        currentTimeDate >= sortedHighlights[i].date &&
        currentTimeDate < sortedHighlights[i + 1].date
      ) {
        return sortedHighlights[i];
      }
    }

    return sortedHighlights[sortedHighlights.length - 1] || null;
  }, [currentTimeDate, highlightsWithPositions]);

  // Get current energy level for badge
  const currentEnergyLevel = useMemo(() => {
    const closestPoint = parsedData.reduce((closest, point) => {
      const closestDiff = Math.abs(
        closest.date.getTime() - currentTimeDate.getTime()
      );
      const pointDiff = Math.abs(
        point.date.getTime() - currentTimeDate.getTime()
      );
      return pointDiff < closestDiff ? point : closest;
    }, parsedData[0]);

    return closestPoint?.level ?? 0;
  }, [parsedData, currentTimeDate]);

  return (
    <div className="w-full max-w-5xl rounded-xl bg-linear-to-b from-[#101929] to-[#08090d] flex flex-col max-h-[90vh] overflow-hidden">
      <div className="sticky top-0 z-10 bg-linear-to-b from-[#101929] to-[#101929]/95 backdrop-blur-sm px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg text-white font-semibold">Energy Insights</h2>
          <div className="flex items-center gap-4">
            <button className="text-sm text-white hover:text-blue-300 transition-colors flex items-center gap-2">
              <span>🏃</span>
              <span>Add activity</span>
            </button>
            <button className="text-sm text-[#788089] hover:text-white cursor-pointer transition-colors">
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 hide-scrollbar">
        <div className="mb-6 pt-4">
          <h3 className="text-sm text-gray-400 font-medium mb-3">
            Today's Energy Rhythm
          </h3>
          <div className="flex items-start justify-between gap-4 mb-4">
            <p className="text-base text-white font-medium">
              Your energy level is high right now.
            </p>
            {currentPhase && (
              <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 whitespace-nowrap">
                <span>⛰</span>
                <span>
                  {currentPhase.label} • {getFocusState(currentEnergyLevel)}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <EnergyChartNew
            data={data}
            highlights={highlights}
            currentTime={currentTime}
          />
        </div>

        <RecommendationText />
        <SleepInfoCards />
      </div>
    </div>
  );
};
