import { useMemo } from "react";
import * as d3 from "d3";

import type { ParsedDataPoint } from "../components/type";
import { findClosestDataPoint } from "../utils/dataPointHelpers";
import { CHART_HEIGHT } from "./constants";

export const useCurrentTimePosition = (
  currentTime: Date | string,
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  const currentTimeDate = useMemo(() => {
    if (currentTime instanceof Date) {
      return currentTime;
    }
    return new Date(currentTime);
  }, [currentTime]);

  return useMemo(() => {
    // Get the time domain from the chart data
    const timeDomain = d3.extent(parsedData, (d) => d.date) as [Date, Date];
    if (!timeDomain[0] || !timeDomain[1]) {
      return { x: 0, y: CHART_HEIGHT / 2, level: 0 };
    }

    // Get the start date of the chart (should be today at 00:00)
    const chartStartDate = new Date(timeDomain[0]);
    chartStartDate.setHours(0, 0, 0, 0);

    // Calculate the current time relative to the chart's start date
    const currentHour = currentTimeDate.getHours();
    const currentMinute = currentTimeDate.getMinutes();
    
    // Create a date for today at the current hour/minute, aligned to the chart's start date
    const currentTimeInChart = new Date(chartStartDate);
    currentTimeInChart.setHours(currentHour, currentMinute, 0, 0);

    // Clamp the time to the chart's domain to ensure it's within the 24-hour range
    const clampedTime = 
      currentTimeInChart < timeDomain[0] ? timeDomain[0] :
      currentTimeInChart > timeDomain[1] ? timeDomain[1] :
      currentTimeInChart;

    const x = xScale(clampedTime);
    const closestPoint = findClosestDataPoint(parsedData, clampedTime);
    const y = closestPoint ? yScale(closestPoint.level) : CHART_HEIGHT / 2;
    const level = closestPoint?.level ?? 0;

    return { x, y, level };
  }, [currentTimeDate, xScale, yScale, parsedData]);
};

