import { useMemo } from 'react'
import * as d3 from 'd3'

import type { ParsedDataPoint } from '../components/type'
import { generateSegments } from '../utils/chartSegments'

export const useChartSegments = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  return useMemo(() => generateSegments(parsedData, xScale, yScale), [parsedData, xScale, yScale])
}
