import type { EnergyPoint, EnergyHighlight } from '../type'

import { useParsedData } from '../../hooks/useParsedData'
import { useChartScales } from '../../hooks/useChartScales'
import { useChartSegments } from '../../hooks/useChartSegments'
import { useTimeLabels } from '../../hooks/useTimeLabels'
import { useHighlights } from '../../hooks/useHighlights'
import { useCurrentTimePosition } from '../../hooks/useCurrentTimePosition'
import { useBackgroundSegments } from '../../hooks/useBackgroundSegments'
import { useHover } from '../../hooks/useHover'
import { CHART_WIDTH, CHART_HEIGHT, MARGIN, HIGHLIGHTS_OFFSET } from '../../hooks/constants'
import { HighlightsLabels } from './HighlightsLabels'
import { ChartTooltip } from './ChartTooltip'
import { useRealTime } from '../../hooks/useRealTime'

export type EnergyChartProps = {
  data: EnergyPoint[]
  highlights: EnergyHighlight[]
  currentTime?: string // Optional, will use real-time if not provided
}

export const EnergyChart = (props: EnergyChartProps) => {
  const { data, highlights } = props

  // Get real-time current time that updates every minute
  const realTime = useRealTime(60000) // Update every 60 seconds

  const parsedData = useParsedData(data)

  // Get scales
  const { xScale, yScale } = useChartScales(parsedData)

  // Get chart elements
  const segments = useChartSegments(parsedData, xScale, yScale)
  const timeLabels = useTimeLabels(parsedData, xScale)
  const highlightsWithPositions = useHighlights(highlights, parsedData, xScale, yScale)
  // Use real-time instead of the static currentTime prop
  const currentTimePosition = useCurrentTimePosition(realTime, parsedData, xScale, yScale)
  const backgroundSegments = useBackgroundSegments(parsedData, xScale)

  const { hoveredPoint, svgRef, containerRef, handleMouseMove, handleMouseLeave } = useHover(
    parsedData,
    xScale,
    yScale
  )

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-x-auto">
      <svg
        ref={svgRef}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background segments */}
        <g>
          {backgroundSegments.map((segment, idx) => (
            <rect
              key={idx}
              x={segment.x1}
              y={MARGIN.top}
              width={segment.x2 - segment.x1}
              height={CHART_HEIGHT - MARGIN.top - MARGIN.bottom}
              fill={segment.color}
            />
          ))}
        </g>

        {/* Time labels */}
        <g className="time-labels">
          {timeLabels.map((label, idx) => (
            <g key={idx}>
              <line
                x1={label.x}
                y1={CHART_HEIGHT - MARGIN.bottom}
                x2={label.x}
                y2={CHART_HEIGHT - MARGIN.bottom + 5}
                stroke="#666"
                strokeWidth={1}
              />
              <text
                x={label.x}
                y={CHART_HEIGHT - MARGIN.bottom + 20}
                fill="#888"
                fontSize="11"
                textAnchor="middle"
                className="font-mono"
              >
                {label.label}
              </text>
            </g>
          ))}
        </g>

        {/* Energy curve segments */}
        {segments.map((segment, idx) => (
          <path
            key={idx}
            d={segment.path}
            fill="none"
            stroke={segment.color}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Current time indicator */}
        <g className="current-time-indicator">
          <line
            x1={currentTimePosition.x}
            y1={MARGIN.top}
            x2={currentTimePosition.x}
            y2={CHART_HEIGHT - MARGIN.bottom}
            stroke="white"
            strokeWidth={0.3}
            strokeDasharray="2,2"
            opacity={0.5}
          />
          <circle
            cx={currentTimePosition.x}
            cy={currentTimePosition.y}
            r={4}
            fill="white"
            stroke="#0b0f1a"
            strokeWidth={2}
          />
        </g>

        {/* Hover indicator */}
        {hoveredPoint && (
          <g className="hover-indicator">
            <circle
              cx={hoveredPoint.svgX}
              cy={hoveredPoint.svgY}
              r={4}
              fill="white"
              stroke="#0b0f1a"
              strokeWidth={2}
            />
            <line
              x1={hoveredPoint.svgX}
              y1={MARGIN.top}
              x2={hoveredPoint.svgX}
              y2={CHART_HEIGHT - MARGIN.bottom}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
          </g>
        )}
      </svg>

      <HighlightsLabels
        highlights={highlightsWithPositions}
        chartHeight={CHART_HEIGHT}
        margin={MARGIN}
        highlightsOffset={HIGHLIGHTS_OFFSET}
      />

      {hoveredPoint && (
        <ChartTooltip hoveredPoint={hoveredPoint} highlights={highlightsWithPositions} />
      )}
    </div>
  )
}
