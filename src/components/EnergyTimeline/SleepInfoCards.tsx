export const SleepInfoCards = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-lg p-3 sm:p-4 border border-gray-800">
          <h4 className="text-xs sm:text-sm text-white font-medium mb-2 sm:mb-3">Last night's sleep</h4>
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="flex-1">
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">8h 5m</p>
              <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">23:40 - 07:25</p>
              <p className="text-xs text-gray-500">Source: Apple Health</p>
            </div>
            <button className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white cursor-pointer border border-blue-500/30 rounded-full hover:bg-blue-500/20 transition-colors whitespace-nowrap shrink-0">
              Edit Sleep
            </button>
          </div>
        </div>

        {/* Sleep recommendation card */}
        <div className="rounded-lg p-3 sm:p-4 border border-gray-800">
          <h4 className="text-xs sm:text-sm text-white font-medium mb-2 sm:mb-3">Your sleep recommendation</h4>
          <p className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">23:15 - 06:15</p>
          <p className="text-xs text-gray-400">
            Try to get at least 6 hours of sleep each day to clear sleep debt.
          </p>
        </div>
      </div>
    </div>
  )
}
