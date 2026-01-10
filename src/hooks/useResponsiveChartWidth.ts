import { useState, useEffect, useRef } from 'react'

import { CHART_WIDTH } from './constants'

export const useResponsiveChartWidth = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(() => {
    // Initialize based on viewport width
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const viewportWidth = window.innerWidth
      const totalPadding = 64
      return Math.max(viewportWidth - totalPadding, 280)
    }
    return CHART_WIDTH
  })

  useEffect(() => {
    const updateWidth = () => {
      const viewportWidth = window.innerWidth

      if (viewportWidth >= 768) {
        const maxContainerWidth = 1024
        const desktopPadding = viewportWidth >= 1024 ? 96 : viewportWidth < 768 ? 64 : 80
        const maxAvailableWidth = Math.min(maxContainerWidth, viewportWidth - desktopPadding)
        setChartWidth(Math.min(CHART_WIDTH, maxAvailableWidth))
        return
      }

      const totalPadding = 64
      const availableWidth = Math.max(viewportWidth - totalPadding, 280)
      setChartWidth(Math.min(availableWidth, viewportWidth - totalPadding))
    }

    // Initial calculation
    updateWidth()

    // Update on window resize with debounce
    let timeoutId: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateWidth, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return { chartWidth, containerRef }
}
