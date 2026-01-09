import { useMemo } from 'react'
import * as d3 from 'd3'

import type { ParsedDataPoint } from '../components/type'
import { CHART_WIDTH, CHART_HEIGHT, MARGIN, HIGHLIGHTS_OFFSET } from './constants'

export const useChartScales = (parsedData: ParsedDataPoint[]) => {
  const xScale = useMemo(() => {
    return d3
      .scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([MARGIN.left, CHART_WIDTH - MARGIN.right - HIGHLIGHTS_OFFSET])
  }, [parsedData])

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, 1])
      .range([CHART_HEIGHT - MARGIN.bottom, MARGIN.top])
  }, [])

  return { xScale, yScale }
}
