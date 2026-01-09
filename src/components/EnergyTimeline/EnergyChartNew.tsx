import type { EnergyPoint, EnergyHighlight } from "../type";
import {
  useParsedData,
  useChartScales,
  useChartSegments,
  useTimeLabels,
  useHighlights,
  useCurrentTimePosition,
  useBackgroundSegments,
  useHover,
} from "./useChartHooks";
import { HighlightsLabels } from "./HighlightsLabels";
import { ChartTooltip } from "./ChartTooltip";

const CHART_WIDTH = 800;
const CHART_HEIGHT = 250;
const MARGIN = { top: 40, right: 200, bottom: 50, left: 60 };
const HIGHLIGHTS_OFFSET = 20;

export type EnergyChartProps = {
  data: EnergyPoint[];
  highlights: EnergyHighlight[];
  currentTime: string;
};

export const EnergyChartNew = (props: EnergyChartProps) => {
  const { data, highlights, currentTime } = props;

  // Parse data
  const parsedData = useParsedData(data);

  // Get scales
  const { xScale, yScale } = useChartScales(parsedData);

  // Get chart elements
  const segments = useChartSegments(parsedData, xScale, yScale);
  const timeLabels = useTimeLabels(parsedData, xScale);
  const highlightsWithPositions = useHighlights(
    highlights,
    parsedData,
    xScale,
    yScale
  );
  const currentTimePosition = useCurrentTimePosition(
    currentTime,
    parsedData,
    xScale,
    yScale
  );
  const backgroundSegments = useBackgroundSegments(parsedData, xScale);

  // Hover handling
  const {
    hoveredPoint,
    svgRef,
    containerRef,
    handleMouseMove,
    handleMouseLeave,
  } = useHover(parsedData, xScale, yScale);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-auto">
      <svg
        ref={svgRef}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background segments */}
        <g opacity={0.1}>
          {backgroundSegments.map((segment, idx) => (
            <rect
              key={idx}
              x={segment.x1}
              y={MARGIN.top}
              width={segment.x2 - segment.x1}
              height={CHART_HEIGHT - MARGIN.top - MARGIN.bottom}
              fill="#ffffff"
            />
          ))}
        </g>

        {/* Time labels */}
        <g className="time-labels">
          {timeLabels.map((label, idx) => (
            <g key={idx}>
              <line
                x1={label.x}
                y1={CHART_HEIGHT - MARGIN.bottom}
                x2={label.x}
                y2={CHART_HEIGHT - MARGIN.bottom + 5}
                stroke="#666"
                strokeWidth={1}
              />
              <text
                x={label.x}
                y={CHART_HEIGHT - MARGIN.bottom + 20}
                fill="#888"
                fontSize="11"
                textAnchor="middle"
                className="font-mono"
              >
                {label.label}
              </text>
            </g>
          ))}
        </g>

        {/* Energy curve segments */}
        {segments.map((segment, idx) => (
          <path
            key={idx}
            d={segment.path}
            fill="none"
            stroke={segment.color}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}

        {/* Current time indicator */}
        <g className="current-time-indicator">
          <line
            x1={currentTimePosition.x}
            y1={MARGIN.top}
            x2={currentTimePosition.x}
            y2={CHART_HEIGHT - MARGIN.bottom}
            stroke="white"
            strokeWidth={2}
            opacity={0.8}
          />
          <circle
            cx={currentTimePosition.x}
            cy={currentTimePosition.y}
            r={6}
            fill="white"
            stroke="#0b0f1a"
            strokeWidth={2}
          />
        </g>

        {/* Hover indicator */}
        {hoveredPoint && (
          <g className="hover-indicator">
            <circle
              cx={hoveredPoint.svgX}
              cy={hoveredPoint.svgY}
              r={4}
              fill="white"
              stroke="#0b0f1a"
              strokeWidth={2}
            />
            <line
              x1={hoveredPoint.svgX}
              y1={MARGIN.top}
              x2={hoveredPoint.svgX}
              y2={CHART_HEIGHT - MARGIN.bottom}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          </g>
        )}

        {/* Highlights markers */}
        {highlightsWithPositions.map((highlight, idx) => (
          <g key={idx} className="highlight-marker">
            <circle
              cx={highlight.x}
              cy={highlight.y}
              r={4}
              fill={highlight.color}
              stroke="#0b0f1a"
              strokeWidth={2}
            />
          </g>
        ))}
      </svg>

      <HighlightsLabels
        highlights={highlightsWithPositions}
        chartHeight={CHART_HEIGHT}
        margin={MARGIN}
        highlightsOffset={HIGHLIGHTS_OFFSET}
      />

      {hoveredPoint && (
        <ChartTooltip
          hoveredPoint={hoveredPoint}
          highlights={highlightsWithPositions}
        />
      )}
    </div>
  );
};
