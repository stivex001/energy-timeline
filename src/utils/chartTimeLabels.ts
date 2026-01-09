import * as d3 from "d3";

import type { ParsedDataPoint, TimeLabel } from "../components/type";

export const generateTimeLabels = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  formatTimeLabelFn: (date: Date) => string
): TimeLabel[] => {
  const labels: TimeLabel[] = [];
  const startTime = parsedData[0]?.date;
  const endTime = parsedData[parsedData.length - 1]?.date;

  if (!startTime || !endTime) return labels;

  for (let hour = 0; hour <= 24; hour += 4) {
    const labelTime = new Date(startTime);
    labelTime.setHours(hour, 0, 0, 0);

    if (labelTime >= startTime && labelTime <= endTime) {
      labels.push({
        time: labelTime,
        x: xScale(labelTime),
        label: formatTimeLabelFn(labelTime),
      });
    }
  }

  return labels;
};

