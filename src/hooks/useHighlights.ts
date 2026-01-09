import { useMemo } from "react";
import * as d3 from "d3";

import type { EnergyHighlight, ParsedDataPoint } from "../components/type";
import { processHighlights } from "../utils/chartHighlights";

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

