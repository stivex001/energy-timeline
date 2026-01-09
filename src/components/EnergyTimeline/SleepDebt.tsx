type SleepDebtProps = {
  days?: number;
  level?: "Low" | "Medium" | "High";
  debtPercentage?: number; // 0-100
};

export const SleepDebt = ({
  days = 21,
  level = "High",
  debtPercentage = 75,
}: SleepDebtProps) => {
  const getStatusColor = () => {
    switch (level) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "text-red-500";
    }
  };

  return (
    <div className="bg-[#0f1624] rounded-lg p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm text-white font-medium">Sleep Debt</h4>
        <span className={`text-sm font-semibold ${getStatusColor()}`}>{level}</span>
      </div>
      <p className="text-xs text-gray-400 mb-4">over {days} days</p>
      
      {/* Gradient bar */}
      <div className="relative w-full h-4 rounded-full overflow-hidden bg-gray-800">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #10b981 0%, #84cc16 20%, #fbbf24 40%, #f97316 60%, #ef4444 80%, #dc2626 100%)",
          }}
        />
        
        {/* Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-lg"
          style={{ left: `${debtPercentage}%` }}
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#0f1624] shadow-md" />
        </div>
      </div>
    </div>
  );
};

