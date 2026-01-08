import { useMemo } from "react";

import { getFocusState } from "./utils";
import { EnergyChart } from "./EnergyChart";
import {
  energyData,
  highlights,
  currentTime,
  customMessage,
} from "../../data/sampleData";

export const EnergyTimeline = () => {
  const data = energyData;
  const message = customMessage;

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
    <div className="w-full max-w-5xl rounded-xl p-6 bg-linear-to-b from-[#101929] to-[#08090d]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-semibold">Energy Insights</h2>
        <div className="flex items-center gap-4">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Add activity
          </button>
          <button className="text-sm text-[#788089] hover:text-white cursor-pointer transition-colors">
            ✕
          </button>
        </div>
      </div>

      {/* Insight text with badge */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="space-y-2">
            <h3 className="text-sm text-gray-500 font-medium">
              Today's Energy Rhythm
            </h3>
            <div>
              <p className="text-base text-white">{message.title}</p>
              <p className="text-base text-white">
                {message.description}
              </p>
            </div>
          </div>
          {currentPhase && (
            <span className="px-2.5 py-2 text-xs font-medium rounded-full bg-[#12274e] text-[#6285c3] border border-blue-500/30 flex items-center gap-1.5">
              <span>⛰</span>
              <span>
                {currentPhase.label} • {getFocusState(currentEnergyLevel)}
              </span>
            </span>
          )}
        </div>
      </div>

      <EnergyChart
        data={data}
        highlights={highlights}
        currentTime={currentTime}
      />
    </div>
  );
};
