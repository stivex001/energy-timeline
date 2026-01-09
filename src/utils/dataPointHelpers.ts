export const findClosestDataPoint = <T extends { date: Date }>(
  data: T[],
  targetTime: Date
): T | null => {
  if (data.length === 0) return null

  let closest = data[0]
  let minDiff = Math.abs(data[0].date.getTime() - targetTime.getTime())

  for (const point of data) {
    const diff = Math.abs(point.date.getTime() - targetTime.getTime())
    if (diff < minDiff) {
      minDiff = diff
      closest = point
    }
  }

  return closest
}

export const findCurrentEnergyLevel = (
  parsedData: Array<{ date: Date; level: number }>,
  currentTime: Date
): number => {
  if (parsedData.length === 0) return 0

  const closestPoint = findClosestDataPoint(parsedData, currentTime)
  return closestPoint?.level ?? 0
}
