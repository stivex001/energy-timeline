import { useMemo } from "react";
import * as d3 from "d3";

import type { ParsedDataPoint } from "../components/type";

import { formatTimeLabel } from "../utils/timeFormatting";
import { generateTimeLabels } from "../utils/chartTimeLabels";

export const useTimeLabels = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>
) => {
  return useMemo(
    () => generateTimeLabels(parsedData, xScale, formatTimeLabel),
    [parsedData, xScale]
  );
};

