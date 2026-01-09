import * as d3 from "d3";

import { getEnergyColor, findClosestDataPoint } from "./utils";

import type {
  EnergyHighlight,
  ParsedDataPoint,
  ChartSegment,
  TimeLabel,
  BackgroundSegment,
  HighlightWithPosition,
} from "../type";

const CHART_HEIGHT = 250;

export const generateSegments = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
): ChartSegment[] => {
  const segmentPaths: ChartSegment[] = [];

  for (let i = 0; i < parsedData.length - 1; i++) {
    const startPoint = parsedData[i];
    const color = getEnergyColor(startPoint.level);

    // If this is the first segment or color changed, start a new segment
    if (i === 0 || getEnergyColor(parsedData[i - 1].level) !== color) {
      const lineGenerator = d3
        .line<ParsedDataPoint>()
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
};

export const generateTimeLabels = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  formatTimeLabel: (date: Date) => string
): TimeLabel[] => {
  const labels: TimeLabel[] = [];
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
};

export const generateBackgroundSegments = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>
): BackgroundSegment[] => {
  const segments: BackgroundSegment[] = [];
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
};

export const processHighlights = (
  highlights: EnergyHighlight[],
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
): HighlightWithPosition[] => {
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
};

