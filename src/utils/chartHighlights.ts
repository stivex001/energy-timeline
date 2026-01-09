import * as d3 from 'd3'

import type { EnergyHighlight, ParsedDataPoint, HighlightWithPosition } from '../components/type'
import { findClosestDataPoint } from './dataPointHelpers'

const CHART_HEIGHT = 250

export const processHighlights = (
  highlights: EnergyHighlight[],
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
): HighlightWithPosition[] => {
  return highlights.map(highlight => {
    const highlightDate = new Date(highlight.time)
    const x = xScale(highlightDate)
    const closestPoint = findClosestDataPoint(parsedData, highlightDate)
    const y = closestPoint ? yScale(closestPoint.level) : CHART_HEIGHT / 2
    const level = closestPoint?.level ?? 0

    return {
      ...highlight,
      x,
      y,
      date: highlightDate,
      level,
    }
  })
}
