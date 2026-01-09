export const SleepInfoCards = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0f1624] rounded-lg p-4 border border-gray-800">
          <h4 className="text-sm text-white font-medium mb-3">
            Last night's sleep
          </h4>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold text-white mb-1">8h 5m</p>
              <p className="text-sm text-gray-400 mb-2">23:40 - 07:25</p>
              <p className="text-xs text-gray-500">Source: Apple Health</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded hover:bg-blue-500/20 transition-colors">
              Edit Sleep
            </button>
          </div>
        </div>

        {/* Sleep recommendation card */}
        <div className="bg-[#0f1624] rounded-lg p-4 border border-gray-800">
          <h4 className="text-sm text-white font-medium mb-3">
            Your sleep recommendation
          </h4>
          <p className="text-2xl font-bold text-white mb-2">23:15 - 06:15</p>
          <p className="text-xs text-gray-400">
            Try to get at least 6 hours of sleep each day to clear sleep debt.
          </p>
        </div>
      </div>
    </div>
  );
};
