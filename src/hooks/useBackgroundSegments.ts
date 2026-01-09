import { useMemo } from "react";
import * as d3 from "d3";

import type { ParsedDataPoint } from "../components/type";
import { generateBackgroundSegments } from "../utils/chartBackground";

export const useBackgroundSegments = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>
) => {
  return useMemo(
    () => generateBackgroundSegments(parsedData, xScale),
    [parsedData, xScale]
  );
};

