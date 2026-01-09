import { useMemo } from 'react'

import type { EnergyPoint, EnergyHighlight, ParsedDataPoint } from '../components/type'

import { useParsedData } from './useParsedData'
import { findCurrentPhase, processHighlightsWithDates } from '../utils/highlightHelpers'
import { findCurrentEnergyLevel } from '../utils/dataPointHelpers'

type UseEnergyInsightsProps = {
  data: EnergyPoint[]
  highlights: EnergyHighlight[]
  currentTime: Date | string
}

type UseEnergyInsightsReturn = {
  parsedData: ParsedDataPoint[]
  currentPhase: {
    time: string
    label: string
    color: string
    date: Date
  } | null
  currentEnergyLevel: number
}

export const useEnergyInsights = ({
  data,
  highlights,
  currentTime,
}: UseEnergyInsightsProps): UseEnergyInsightsReturn => {
  const parsedData = useParsedData(data)

  // Convert current time string to Date, or use Date directly
  const currentTimeDate = useMemo(() => {
    if (currentTime instanceof Date) {
      return currentTime
    }
    return new Date(currentTime)
  }, [currentTime])

  // Process highlights with dates
  const highlightsWithDates = useMemo(() => processHighlightsWithDates(highlights), [highlights])

  // Find current phase from highlights
  const currentPhase = useMemo(
    () => findCurrentPhase(currentTimeDate, highlightsWithDates),
    [currentTimeDate, highlightsWithDates]
  )

  // Get current energy level for badge
  const currentEnergyLevel = useMemo(
    () => findCurrentEnergyLevel(parsedData, currentTimeDate),
    [parsedData, currentTimeDate]
  )

  return {
    parsedData,
    currentPhase,
    currentEnergyLevel,
  }
}
