import { BiRun } from 'react-icons/bi'
import { IoTrendingUp } from 'react-icons/io5'

import { getFocusState } from '../../utils/focusState'
import { energyData, highlights, customMessage } from '../../data/sampleData'
import { EnergyChart } from './EnergyChart'
import { RecommendationText } from './RecommendationText'
import { SleepInfoCards } from './SleepInfoCards'
import { useEnergyInsights } from '../../hooks/useEnergyInsights'
import { useRealTime } from '../../hooks/useRealTime'

export const EnergyTimeline = () => {
  // Get real-time current time that updates every minute
  const realTime = useRealTime(60000) // Update every 60 seconds

  const { currentPhase, currentEnergyLevel } = useEnergyInsights({
    data: energyData,
    highlights,
    currentTime: realTime,
  })

  return (
    <div className="w-full max-w-5xl rounded-xl bg-linear-to-b from-[#101929] to-[#08090d] flex flex-col h-[90vh] max-h-[90vh] overflow-hidden mx-auto">
      <div className="sticky top-0 z-10 bg-linear-to-b from-[#101929] to-[#101929]/95 backdrop-blur-sm p-4 sm:p-5 md:p-6 mb-3 sm:mb-4 md:mb-5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <h2 className="text-sm sm:text-base text-white font-semibold">Energy Insights</h2>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="text-xs sm:text-sm text-white hover:text-blue-300 transition-colors flex items-center gap-1.5 sm:gap-2">
              <BiRun className="text-white text-sm sm:text-base" />
              <span className="hidden sm:inline">Add activity</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button className="text-sm sm:text-base text-[#788089] hover:text-white cursor-pointer transition-colors">
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 hide-scrollbar">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm text-gray-400 font-medium mb-2 sm:mb-3">Today's Energy Rhythm</h3>
            <p className="text-sm sm:text-base text-[#f0efed] mb-2">{`Your energy level is ${getFocusState(
              currentEnergyLevel
            )} right now as you are in your ${currentPhase?.label}.`}</p>
            <p className="text-xs sm:text-sm text-white opacity-80">{customMessage.description}</p>
          </div>
          {currentPhase && (
            <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto">
              <IoTrendingUp className="text-sm" />
              <span>
                {currentPhase.label} • {getFocusState(currentEnergyLevel)}
              </span>
            </span>
          )}
        </div>

        <div className="mb-4 sm:mb-6">
          <EnergyChart data={energyData} highlights={highlights} />
        </div>

        <RecommendationText />
        <SleepInfoCards />
      </div>
    </div>
  )
}
