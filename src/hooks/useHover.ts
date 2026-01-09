import { useState, useRef } from 'react'
import * as d3 from 'd3'

import type { HoveredPoint, ParsedDataPoint } from '../components/type'
import { findClosestDataPoint } from '../utils/dataPointHelpers'

export const useHover = (
  parsedData: ParsedDataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !containerRef.current) return

    const svgRect = svgRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    // Get mouse position relative to SVG
    const mouseX = event.clientX - svgRect.left

    // Account for SVG scaling (viewBox)
    const svgWidth = svgRef.current.viewBox.baseVal.width
    const scaleX = svgRect.width / svgWidth
    const scaleY = svgRect.height / svgRef.current.viewBox.baseVal.height

    // Convert to SVG coordinate space
    const svgX = mouseX / scaleX

    // Convert screen x to date
    const invertedDate = xScale.invert(svgX)
    const closestPoint = findClosestDataPoint(parsedData, invertedDate)

    if (closestPoint) {
      const pointSvgX = xScale(closestPoint.date)
      const pointSvgY = yScale(closestPoint.level)

      // Convert SVG coordinates to screen coordinates for tooltip positioning
      const screenX = pointSvgX * scaleX + (svgRect.left - containerRect.left)
      const screenY = pointSvgY * scaleY + (svgRect.top - containerRect.top)

      setHoveredPoint({
        svgX: pointSvgX,
        svgY: pointSvgY,
        screenX,
        screenY,
        level: closestPoint.level,
        time: closestPoint.date,
      })
    }
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  return {
    hoveredPoint,
    svgRef,
    containerRef,
    handleMouseMove,
    handleMouseLeave,
  }
}
