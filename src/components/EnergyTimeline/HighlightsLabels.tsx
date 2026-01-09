import type { HighlightWithPosition } from "../type";

type HighlightsLabelsProps = {
  highlights: HighlightWithPosition[];
  chartHeight: number;
  margin: { top: number; right: number; bottom: number; left: number };
  highlightsOffset: number;
};

export const HighlightsLabels = ({
  highlights,
  chartHeight,
  margin,
  highlightsOffset,
}: HighlightsLabelsProps) => {
  return (
    <div
      className="absolute top-0 right-0 pointer-events-none"
      style={{
        width: `${highlightsOffset + 140}px`,
        height: `${chartHeight - margin.bottom - margin.top}px`,
        marginTop: `${margin.top}px`,
      }}
    >
      {highlights.map((highlight, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 text-xs whitespace-nowrap"
          style={{
            position: "absolute",
            top: `${highlight.y - margin.top - 8}px`,
            left: "8px",
            transform: "translateY(-50%)",
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: highlight.color }}
          />
          <span className="text-gray-300 text-xs leading-tight">
            {highlight.label}
          </span>
        </div>
      ))}
    </div>
  );
};

