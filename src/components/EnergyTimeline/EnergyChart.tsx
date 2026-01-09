import { useMemo, useState } from "react";
import * as d3 from "d3";

import type { EnergyPoint, EnergyHighlight } from "../type";
import { getEnergyColor } from "./utils";

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

export const EnergyChart = ({
  data,
  highlights,
  currentTime,
}: EnergyChartProps) => {
  const [hoveredPoint, setHoveredPoint] =
    useState<HoveredPoint | null>(null);

  const parsedData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        date: new Date(d.time),
      })),
    [data]
  );

  const xScale = useMemo(() => {
    return d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
      .range([
        MARGIN.left,
        CHART_WIDTH - MARGIN.right - HIGHLIGHTS_OFFSET,
      ]);
  }, [parsedData]);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, 1])
      .range([CHART_HEIGHT - MARGIN.bottom, MARGIN.top]);
  }, []);

  const lineGenerator = useMemo(() => {
    return d3
      .line<(typeof parsedData)[number]>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.level))
      .curve(d3.curveCatmullRom);
  }, [xScale, yScale]);

  const currentDate = useMemo(() => new Date(currentTime), [currentTime]);

  const currentPoint = useMemo(() => {
    return parsedData.reduce((closest, point) => {
      const diff = Math.abs(point.date.getTime() - currentDate.getTime());
      const closestDiff = Math.abs(
        closest.date.getTime() - currentDate.getTime()
      );
      return diff < closestDiff ? point : closest;
    }, parsedData[0]);
  }, [parsedData, currentDate]);

  const currentX = xScale(currentDate);
  const currentY = yScale(currentPoint.level);

  const timeTicks = useMemo(() => {
    const start = d3.timeHour.floor(parsedData[0].date);
    const end = parsedData[parsedData.length - 1].date;
    return d3.timeHour.every(4)?.range(start, end) ?? [];
  }, [parsedData]);

  const formatTime = d3.timeFormat("%-I %p");

  const daySegments = [
    { label: "Night", start: 0, end: 6 },
    { label: "Morning", start: 6, end: 12 },
    { label: "Afternoon", start: 12, end: 18 },
    { label: "Evening", start: 18, end: 24 },
  ];

  const baseDate = useMemo(() => {
    const d = new Date(parsedData[0].date);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [parsedData]);

  const hourToDate = (hour: number) => {
    const d = new Date(baseDate);
    d.setHours(hour);
    return d;
  };

  const drawableHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

  const coloredSegments = useMemo(() => {
    const segments: (typeof parsedData)[] = [];
    let currentSegment: typeof parsedData = [];

    parsedData.forEach((point, index) => {
      if (currentSegment.length === 0) {
        currentSegment.push(point);
        return;
      }

      const prev = currentSegment[currentSegment.length - 1];

      if (getEnergyColor(prev.level) === getEnergyColor(point.level)) {
        currentSegment.push(point);
      } else {
        segments.push(currentSegment);
        currentSegment = [prev, point];
      }

      if (index === parsedData.length - 1) {
        segments.push(currentSegment);
      }
    });

    return segments;
  }, [parsedData]);

  return (
    <div className="relative">
      <svg width={CHART_WIDTH} height={CHART_HEIGHT} className="w-full h-auto">
        {/* Background segments */}
        {daySegments.map((segment, index) => {
          const xStart = xScale(hourToDate(segment.start));
          const xEnd = xScale(hourToDate(segment.end));

          return (
            <rect
              key={index}
              x={xStart}
              y={MARGIN.top}
              width={xEnd - xStart}
              height={drawableHeight}
              className="fill-white/5"
            />
          );
        })}

        {/* Energy curve */}
        {coloredSegments.map((segment, index) => {
          const d = lineGenerator(segment);
          if (!d) return null;

          return (
            <path
              key={index}
              d={d}
              fill="none"
              stroke={getEnergyColor(segment[0].level)}
              strokeWidth={3}
            />
          );
        })}

        {/* Current time line */}
        <line
          x1={currentX}
          x2={currentX}
          y1={MARGIN.top}
          y2={CHART_HEIGHT - MARGIN.bottom}
          stroke="white"
          strokeWidth={1}
          strokeDasharray="4 4"
        />

        {/* Current point */}
        <circle cx={currentX} cy={currentY} r={5} fill="white" />

        {/* Hover point */}
        {hoveredPoint && (
          <circle
            cx={hoveredPoint.svgX}
            cy={hoveredPoint.svgY}
            r={5}
            fill="white"
            pointerEvents="none"
          />
        )}

        {/* Time labels */}
        {timeTicks.map((time, index) => (
          <text
            key={index}
            x={xScale(time)}
            y={CHART_HEIGHT}
            textAnchor="middle"
            className="fill-gray-400 text-xs"
          >
            {formatTime(time)}
          </text>
        ))}

        {/* Interaction layer (MUST BE LAST) */}
        <rect
          x={MARGIN.left}
          y={MARGIN.top}
          width={
            CHART_WIDTH - MARGIN.left - MARGIN.right - HIGHLIGHTS_OFFSET
          }
          height={drawableHeight}
          fill="transparent"
          onMouseMove={(e) => {
            const bounds = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;

            const hoveredDate = xScale.invert(mouseX);

            const closest = parsedData.reduce((a, b) =>
              Math.abs(b.date.getTime() - hoveredDate.getTime()) <
              Math.abs(a.date.getTime() - hoveredDate.getTime())
                ? b
                : a
            );

            setHoveredPoint({
              svgX: xScale(closest.date),
              svgY: yScale(closest.level),
              screenX: e.clientX,
              screenY: e.clientY,
              level: closest.level,
              time: closest.date,
            });
          }}
          onMouseLeave={() => setHoveredPoint(null)}
        />
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="fixed z-50 rounded-md bg-black/80 px-3 py-2 text-xs text-white"
          style={{
            left: hoveredPoint.screenX + 12,
            top: hoveredPoint.screenY + 12,
          }}
        >
          <div className="font-medium">
            {d3.timeFormat("%-I:%M %p")(hoveredPoint.time)}
          </div>
          <div>Energy: {hoveredPoint.level.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};
