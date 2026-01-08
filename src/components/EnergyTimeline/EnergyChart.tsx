import { useMemo, useState, useRef } from "react";
import * as d3 from "d3";

import type { EnergyPoint, EnergyHighlight } from "../type";
import { getEnergyColor, getFocusState, formatTimeLabel, findClosestDataPoint } from "./utils";

const CHART_WIDTH = 800;
const CHART_HEIGHT = 250;
const MARGIN = { top: 40, right: 200, bottom: 50, left: 60 };
const HIGHLIGHTS_OFFSET = 20;

export type EnergyChartProps = {
  data: EnergyPoint[];
  highlights: EnergyHighlight[];
  currentTime: string;
};

type HoveredPoint = {
  svgX: number;
  svgY: number;
  screenX: number;
  screenY: number;
  level: number;
  time: Date;
};

export const EnergyChart = (props: EnergyChartProps) => {
  const { data, highlights, currentTime } = props;
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      date: new Date(d.time),
    }));
  }, [data]);

  const currentTimeDate = useMemo(() => new Date(currentTime), [currentTime]);

  const xScale = useMemo(() => {
    return d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
      .range([MARGIN.left, CHART_WIDTH - MARGIN.right - HIGHLIGHTS_OFFSET]);
  }, [parsedData]);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, 1])
      .range([CHART_HEIGHT - MARGIN.bottom, MARGIN.top]);
  }, []);

  // Create segments with different colors
  const segments = useMemo(() => {
    const segmentPaths: { path: string; color: string; startIndex: number; endIndex: number }[] = [];

    for (let i = 0; i < parsedData.length - 1; i++) {
      const startPoint = parsedData[i];
      const color = getEnergyColor(startPoint.level);

      // If this is the first segment or color changed, start a new segment
      if (i === 0 || getEnergyColor(parsedData[i - 1].level) !== color) {
        const lineGenerator = d3
          .line<(typeof parsedData)[number]>()
          .x((d) => xScale(d.date))
          .y((d) => yScale(d.level))
          .curve(d3.curveCatmullRom);

        // Find where this color segment ends
        let endIndex = i + 1;
        for (let j = i + 1; j < parsedData.length; j++) {
          if (getEnergyColor(parsedData[j].level) !== color) {
            endIndex = j;
            break;
          }
          endIndex = j + 1;
        }

        const segmentData = parsedData.slice(i, Math.min(endIndex, parsedData.length));
        const path = lineGenerator(segmentData);

        if (path) {
          segmentPaths.push({ path, color, startIndex: i, endIndex: endIndex - 1 });
        }
      }
    }

    return segmentPaths;
  }, [parsedData, xScale, yScale]);

  // Generate time labels (every 3 hours)
  const timeLabels = useMemo(() => {
    const labels: { time: Date; x: number; label: string }[] = [];
    const startTime = parsedData[0]?.date;
    const endTime = parsedData[parsedData.length - 1]?.date;

    if (!startTime || !endTime) return labels;

    for (let hour = 0; hour <= 24; hour += 3) {
      const labelTime = new Date(startTime);
      labelTime.setHours(hour, 0, 0, 0);

      if (labelTime >= startTime && labelTime <= endTime) {
        labels.push({
          time: labelTime,
          x: xScale(labelTime),
          label: formatTimeLabel(labelTime),
        });
      }
    }

    return labels;
  }, [parsedData, xScale]);

  // Process highlights with positions
  const highlightsWithPositions = useMemo(() => {
    return highlights.map((highlight) => {
      const highlightDate = new Date(highlight.time);
      const x = xScale(highlightDate);
      const closestPoint = findClosestDataPoint(parsedData, highlightDate);
      const y = closestPoint ? yScale(closestPoint.level) : CHART_HEIGHT / 2;
      const level = closestPoint?.level ?? 0;

      return {
        ...highlight,
        x,
        y,
        date: highlightDate,
        level,
      };
    });
  }, [highlights, xScale, yScale, parsedData]);

  // Current time position
  const currentTimePosition = useMemo(() => {
    const x = xScale(currentTimeDate);
    const closestPoint = findClosestDataPoint(parsedData, currentTimeDate);
    const y = closestPoint ? yScale(closestPoint.level) : CHART_HEIGHT / 2;
    const level = closestPoint?.level ?? 0;

    return { x, y, level };
  }, [currentTimeDate, xScale, yScale, parsedData]);

  // Background segments for day parts
  const backgroundSegments = useMemo(() => {
    const segments: { x1: number; x2: number; label: string }[] = [];
    const times = [
      { hour: 0, label: "Night" },
      { hour: 6, label: "Morning" },
      { hour: 12, label: "Afternoon" },
      { hour: 18, label: "Evening" },
      { hour: 24, label: "Night" },
    ];

    const startTime = parsedData[0]?.date;
    if (!startTime) return segments;

    for (let i = 0; i < times.length - 1; i++) {
      const time1 = new Date(startTime);
      time1.setHours(times[i].hour, 0, 0, 0);
      const time2 = new Date(startTime);
      time2.setHours(times[i + 1].hour, 0, 0, 0);

      if (time1 >= parsedData[0].date && time2 <= parsedData[parsedData.length - 1].date) {
        segments.push({
          x1: xScale(time1),
          x2: xScale(time2),
          label: times[i].label,
        });
      }
    }

    return segments;
  }, [parsedData, xScale]);

  // Handle mouse move for tooltip
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !containerRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Get mouse position relative to SVG
    const mouseX = event.clientX - svgRect.left;

    // Account for SVG scaling (viewBox)
    const svgWidth = svgRef.current.viewBox.baseVal.width;
    const scaleX = svgRect.width / svgWidth;
    const scaleY = svgRect.height / svgRef.current.viewBox.baseVal.height;

    // Convert to SVG coordinate space
    const svgX = mouseX / scaleX;

    // Convert screen x to date
    const invertedDate = xScale.invert(svgX);
    const closestPoint = findClosestDataPoint(parsedData, invertedDate);

    if (closestPoint) {
      const pointSvgX = xScale(closestPoint.date);
      const pointSvgY = yScale(closestPoint.level);

      // Convert SVG coordinates to screen coordinates for tooltip positioning
      const screenX = pointSvgX * scaleX + (svgRect.left - containerRect.left);
      const screenY = pointSvgY * scaleY + (svgRect.top - containerRect.top);

      setHoveredPoint({
        svgX: pointSvgX,
        svgY: pointSvgY,
        screenX,
        screenY,
        level: closestPoint.level,
        time: closestPoint.date,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

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

          {/* Key highlight time labels below curve */}
          {highlightsWithPositions
            .filter((h) => {
              // Only show "Wake up" and "Evening Wind Down" labels below the curve
              return h.label === "Wake up" || h.label === "Evening Wind Down";
            })
            .map((highlight, idx) => (
              <g key={`highlight-label-${idx}`}>
                <text
                  x={highlight.x}
                  y={CHART_HEIGHT - MARGIN.bottom + 20}
                  fill="#666"
                  fontSize="11"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {formatTimeLabel(highlight.date)}{" "}
                  {highlight.label === "Evening Wind Down" ? "Wind down" : highlight.label}
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

      {/* Highlights labels (positioned to the right) */}
      <div
        className="absolute top-0 right-0 flex flex-col justify-start gap-1 pointer-events-none"
        style={{
          width: `${HIGHLIGHTS_OFFSET + 120}px`,
          height: `${CHART_HEIGHT - MARGIN.bottom - MARGIN.top}px`,
          marginTop: `${MARGIN.top}px`,
        }}
      >
        {highlightsWithPositions.map((highlight, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-xs whitespace-nowrap"
            style={{
              position: "absolute",
              top: `${highlight.y - MARGIN.top - 6}px`,
              left: "10px",
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: highlight.color }}
            />
            <span className="text-gray-400">{highlight.label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
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
            {(() => {
              const phase = highlightsWithPositions.find(
                (h) => Math.abs(h.x - hoveredPoint.svgX) < 30
              );
              return phase?.label || "Energy Point";
            })()}
          </div>
          <div className="text-xs text-gray-400">{getFocusState(hoveredPoint.level)}</div>
        </div>
      )}
    </div>
  );
};

