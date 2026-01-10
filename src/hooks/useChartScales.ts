import { useMemo } from 'react'
import * as d3 from 'd3'

import type { ParsedDataPoint } from '../components/type'
import { CHART_HEIGHT, MARGIN, HIGHLIGHTS_OFFSET } from './constants'


const getResponsiveMargins = (chartWidth: number) => {
  const isMobile = chartWidth < 768
  return {
    ...MARGIN,
    right: isMobile ? 20 : MARGIN.right, 
    left: isMobile ? 40 : MARGIN.left, 
  }
}

export const useChartScales = (parsedData: ParsedDataPoint[], chartWidth: number) => {
  const margins = useMemo(() => getResponsiveMargins(chartWidth), [chartWidth])

  const xScale = useMemo(() => {
    const rightOffset = chartWidth < 768 ? 0 : HIGHLIGHTS_OFFSET // No highlights offset on mobile
    return d3
      .scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([margins.left, chartWidth - margins.right - rightOffset])
  }, [parsedData, chartWidth, margins])

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, 1])
      .range([CHART_HEIGHT - margins.bottom, margins.top])
  }, [margins])

  return { xScale, yScale }
}
