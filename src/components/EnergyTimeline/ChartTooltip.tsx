import type { HoveredPoint, HighlightWithPosition } from "../type";
import { getEnergyColor } from "../../utils/energyColor";
import { getFocusState } from "../../utils/focusState";

type ChartTooltipProps = {
  hoveredPoint: HoveredPoint;
  highlights: HighlightWithPosition[];
};

export const ChartTooltip = ({ hoveredPoint, highlights }: ChartTooltipProps) => {
  const phase = highlights.find((h) => Math.abs(h.x - hoveredPoint.svgX) < 30);

  return (
    <div
      className="absolute bg-[#1a1f2e] border border-gray-700 rounded-lg px-3 py-2 shadow-xl z-10 pointer-events-none"
      style={{
        left: `${hoveredPoint.screenX}px`,
        top: `${hoveredPoint.screenY - 80}px`,
        transform: "translateX(-50%)",
      }}
    >
      <div
        className="text-xs font-medium mb-1"
        style={{ color: getEnergyColor(hoveredPoint.level) }}
      >
        {phase?.label || "Energy Point"}
      </div>
      <div className="text-xs text-gray-400">{getFocusState(hoveredPoint.level)}</div>
    </div>
  );
};

