import { useMemo, useState, useRef } from "react";
import * as d3 from "d3";

import { formatTimeLabel, findClosestDataPoint } from "./utils";
import {
  generateSegments,
  generateTimeLabels,
  generateBackgroundSegments,
  processHighlights,
} from "./chartHelpers";

import type {
  EnergyPoint,
  EnergyHighlight,
  HoveredPoint,
  ParsedDataPoint,
} from "../type";

const CHART_WIDTH = 800;
const CHART_HEIGHT = 250;
const MARGIN = { top: 40, right: 200, bottom: 50, left: 60 };
const HIGHLIGHTS_OFFSET = 20;

export const useParsedData = (data: EnergyPoint[]) => {
  return useMemo(() => {
    const parsed = data.map((d) => ({
      ...d,
      date: new Date(d.time),
    })) as ParsedDataPoint[];

    // Interpolate additional points between existing ones for smoother curve
    const interpolated: ParsedDataPoint[] = [];
    const intervalMinutes = 15; // Create points every 15 minutes

    for (let i = 0; i < parsed.length - 1; i++) {
      const current = parsed[i];
      const next = parsed[i + 1];

      // Add the current point
      interpolated.push(current);

      // Calculate time difference in minutes
      const timeDiff = (next.date.getTime() - current.date.getTime()) / (1000 * 60);
      const steps = Math.floor(timeDiff / intervalMinutes);

      // Interpolate points between current and next
      for (let step = 1; step < steps; step++) {
        const t = step / steps; // Interpolation factor (0 to 1)
        const interpolatedTime = new Date(
          current.date.getTime() + (next.date.getTime() - current.date.getTime()) * t
        );
        const interpolatedLevel = current.level + (next.level - current.level) * t;

        interpolated.push({
          id: current.id + step * 0.01, // Unique ID for interpolated points
          time: interpolatedTime.toISOString(),
          level: interpolatedLevel,
          date: interpolatedTime,
        });
      }
    }

    // Add the last point
    if (parsed.length > 0) {
      interpolated.push(parsed[parsed.length - 1]);
    }

    return interpolated;
  }, [data]);
};

export const useChartScales = (parsedData: ParsedDataPoint[]) => {
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

  return { xScale, yScale };
};

export const useChartSegments = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  return useMemo(
    () => generateSegments(parsedData, xScale, yScale),
    [parsedData, xScale, yScale]
  );
};

export const useTimeLabels = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>
) => {
  return useMemo(
    () => generateTimeLabels(parsedData, xScale, formatTimeLabel),
    [parsedData, xScale]
  );
};

export const useHighlights = (
  highlights: EnergyHighlight[],
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  return useMemo(
    () => processHighlights(highlights, parsedData, xScale, yScale),
    [highlights, parsedData, xScale, yScale]
  );
};

export const useCurrentTimePosition = (
  currentTime: string,
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  const currentTimeDate = useMemo(() => new Date(currentTime), [currentTime]);

  return useMemo(() => {
    const x = xScale(currentTimeDate);
    const closestPoint = findClosestDataPoint(parsedData, currentTimeDate);
    const y = closestPoint ? yScale(closestPoint.level) : CHART_HEIGHT / 2;
    const level = closestPoint?.level ?? 0;

    return { x, y, level };
  }, [currentTimeDate, xScale, yScale, parsedData]);
};

export const useBackgroundSegments = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>
) => {
  return useMemo(
    () => generateBackgroundSegments(parsedData, xScale),
    [parsedData, xScale]
  );
};

export const useHover = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return {
    hoveredPoint,
    svgRef,
    containerRef,
    handleMouseMove,
    handleMouseLeave,
  };
};

