import { useMemo } from 'react'

import type { EnergyPoint, ParsedDataPoint } from '../components/type'

export const useParsedData = (data: EnergyPoint[]) => {
  return useMemo(() => {
    const parsed = data.map(d => ({
      ...d,
      date: new Date(d.time),
    })) as ParsedDataPoint[]

    // Interpolate additional points between existing ones for smoother curve
    const interpolated: ParsedDataPoint[] = []
    const intervalMinutes = 15 // Create points every 15 minutes

    for (let i = 0; i < parsed.length - 1; i++) {
      const current = parsed[i]
      const next = parsed[i + 1]

      // Add the current point
      interpolated.push(current)

      // Calculate time difference in minutes
      const timeDiff = (next.date.getTime() - current.date.getTime()) / (1000 * 60)
      const steps = Math.floor(timeDiff / intervalMinutes)

      // Interpolate points between current and next
      for (let step = 1; step < steps; step++) {
        const t = step / steps // Interpolation factor (0 to 1)
        const interpolatedTime = new Date(
          current.date.getTime() + (next.date.getTime() - current.date.getTime()) * t
        )
        const interpolatedLevel = current.level + (next.level - current.level) * t

        interpolated.push({
          id: current.id + step * 0.01, // Unique ID for interpolated points
          time: interpolatedTime.toISOString(),
          level: interpolatedLevel,
          date: interpolatedTime,
        })
      }
    }

    // Add the last point
    if (parsed.length > 0) {
      interpolated.push(parsed[parsed.length - 1])
    }

    return interpolated
  }, [data])
}
