import * as d3 from 'd3'

import type { ParsedDataPoint, ChartSegment } from '../components/type'
import { getEnergyColor } from './energyColor'

export const generateSegments = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
): ChartSegment[] => {
  const segmentPaths: ChartSegment[] = []

  for (let i = 0; i < parsedData.length - 1; i++) {
    const startPoint = parsedData[i]
    const color = getEnergyColor(startPoint.level)

    // If this is the first segment or color changed, start a new segment
    if (i === 0 || getEnergyColor(parsedData[i - 1].level) !== color) {
      const lineGenerator = d3
        .line<ParsedDataPoint>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.level))
        .curve(d3.curveCatmullRom)

      // Find where this color segment ends
      let endIndex = i + 1
      for (let j = i + 1; j < parsedData.length; j++) {
        if (getEnergyColor(parsedData[j].level) !== color) {
          endIndex = j
          break
        }
        endIndex = j + 1
      }

      const segmentData = parsedData.slice(i, Math.min(endIndex, parsedData.length))
      const path = lineGenerator(segmentData)

      if (path) {
        segmentPaths.push({ path, color, startIndex: i, endIndex: endIndex - 1 })
      }
    }
  }

  return segmentPaths
}
