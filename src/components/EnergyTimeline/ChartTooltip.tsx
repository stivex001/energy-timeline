import type { HoveredPoint, HighlightWithPosition } from '../type'
import { getEnergyColor } from '../../utils/energyColor'
import { getFocusState } from '../../utils/focusState'

type ChartTooltipProps = {
  hoveredPoint: HoveredPoint
  highlights: HighlightWithPosition[]
}

export const ChartTooltip = ({ hoveredPoint, highlights }: ChartTooltipProps) => {
  const phase = highlights.find(h => Math.abs(h.x - hoveredPoint.svgX) < 30)

  // Calculate tooltip position to prevent overflow on mobile
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024
  const tooltipWidth = 150
  const tooltipLeft = Math.max(
    10,
    Math.min(windowWidth - tooltipWidth - 10, hoveredPoint.screenX - tooltipWidth / 2)
  )

  return (
    <div
      className="absolute bg-[#1a1f2e] border border-gray-700 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-xl z-10 pointer-events-none max-w-[140px] sm:max-w-none"
      style={{
        left: `${tooltipLeft}px`,
        top: `${hoveredPoint.screenY - 80}px`,
        transform: 'translateX(0)',
      }}
    >
      <div
        className="text-xs font-medium mb-0.5 sm:mb-1 truncate"
        style={{ color: getEnergyColor(hoveredPoint.level) }}
      >
        {phase?.label || 'Energy Point'}
      </div>
      <div className="text-xs text-gray-400 truncate">{getFocusState(hoveredPoint.level)}</div>
    </div>
  )
}
