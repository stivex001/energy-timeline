import * as d3 from 'd3'

import type { ParsedDataPoint, BackgroundSegment } from '../components/type'

export const generateBackgroundSegments = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>
): BackgroundSegment[] => {
  const segments: BackgroundSegment[] = []
  const times = [
    { hour: 0, label: 'Night' },
    { hour: 6, label: 'Morning' },
    { hour: 12, label: 'Afternoon' },
    { hour: 18, label: 'Evening' },
    { hour: 24, label: 'Night' },
  ]

  const startTime = parsedData[0]?.date
  if (!startTime) return segments

  for (let i = 0; i < times.length - 1; i++) {
    const time1 = new Date(startTime)
    time1.setHours(times[i].hour, 0, 0, 0)
    const time2 = new Date(startTime)
    time2.setHours(times[i + 1].hour, 0, 0, 0)

    if (time1 >= parsedData[0].date && time2 <= parsedData[parsedData.length - 1].date) {
      segments.push({
        x1: xScale(time1),
        x2: xScale(time2),
        label: times[i].label,
      })
    }
  }

  return segments
}
