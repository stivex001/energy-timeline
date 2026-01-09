import * as d3 from 'd3'

import type { ParsedDataPoint, BackgroundSegment } from '../components/type'

// Subtle background colors for different parts of the day
const DAY_TIME_COLORS: Record<string, string> = {
  Night: 'rgba(74, 74, 133, 0.1)', // Subtle dark blue/purple for night (0-6, 18-24)
  Morning: 'rgba(66, 135, 245, 0.08)', // Subtle blue for morning (6-12)
  Afternoon: 'rgba(220, 143, 105, 0.08)', // Subtle orange for afternoon (12-18)
  Evening: 'rgba(74, 74, 133, 0.1)', // Same as night for evening (18-24)
}

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

    // Check if the segment is within the data range
    const segmentStart = time1 < parsedData[0].date ? parsedData[0].date : time1
    const segmentEnd =
      time2 > parsedData[parsedData.length - 1].date
        ? parsedData[parsedData.length - 1].date
        : time2

    if (segmentStart < segmentEnd) {
      const label = times[i].label
      segments.push({
        x1: xScale(segmentStart),
        x2: xScale(segmentEnd),
        label,
        color: DAY_TIME_COLORS[label] || 'rgba(255, 255, 255, 0.1)',
      })
    }
  }

  return segments
}
