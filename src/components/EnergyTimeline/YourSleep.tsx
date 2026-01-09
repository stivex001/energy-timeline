import { useMemo } from "react";
import * as d3 from "d3";

type SleepDataPoint = {
  time: number; // 0-24 hours
  depth: number; // 0-1 sleep depth
};

type YourSleepProps = {
  wakeTime?: string;
  sleepData?: SleepDataPoint[];
};

// Generate sample sleep data if not provided
const generateSleepData = (): SleepDataPoint[] => {
  const data: SleepDataPoint[] = [];
  // Sleep starts around 23:00 (hour 23) and ends at 06:00 (hour 6)
  // Create more granular data points for smoother curve
  const startHour = 23;
  const endHour = 6;
  
  // Generate points every 30 minutes for smoother visualization
  for (let hour = startHour; hour <= 30; hour += 0.5) {
    const normalizedHour = hour % 24;
    let depth = 0;

    if (normalizedHour >= 23 || normalizedHour <= 0.5) {
      // Falling asleep - gradual increase from 23:00 to 00:30
      const progress = normalizedHour >= 23 ? (24 - normalizedHour) : normalizedHour;
      depth = 0.1 + progress * 0.3;
    } else if (normalizedHour >= 0.5 && normalizedHour <= 2) {
      // Light sleep phase
      depth = 0.4 + (normalizedHour - 0.5) * 0.15;
    } else if (normalizedHour >= 2 && normalizedHour <= 4) {
      // Deep sleep phase - peak
      depth = 0.55 + (normalizedHour - 2) * 0.2;
    } else if (normalizedHour >= 4 && normalizedHour <= 5.5) {
      // REM sleep - variable but high
      depth = 0.75 + (normalizedHour - 4) * 0.1;
    } else if (normalizedHour >= 5.5 && normalizedHour <= 6) {
      // Waking up - gradual decrease
      depth = 0.85 - (normalizedHour - 5.5) * 1.1;
    }

    data.push({ 
      time: normalizedHour, 
      depth: Math.min(1, Math.max(0, depth)) 
    });
  }

  return data;
};

export const YourSleep = ({
  wakeTime = "06:00",
  sleepData,
}: YourSleepProps) => {
  const data = useMemo(() => sleepData || generateSleepData(), [sleepData]);

  const width = 240;
  const height = 100;
  const margin = { top: 10, right: 15, bottom: 25, left: 15 };

  const xScale = useMemo(() => {
    const times = data.map((d) => d.time);
    return d3
      .scaleLinear()
      .domain([d3.min(times) ?? 0, d3.max(times) ?? 24])
      .range([margin.left, width - margin.right]);
  }, [data]);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);
  }, []);

  const areaPath = useMemo(() => {
    const areaGenerator = d3
      .area<SleepDataPoint>()
      .x((d) => xScale(d.time))
      .y0(height - margin.bottom)
      .y1((d) => yScale(d.depth))
      .curve(d3.curveCatmullRom);

    return areaGenerator(data);
  }, [data, xScale, yScale]);

  return (
    <div className="bg-[#0f1624] rounded-lg p-4 border border-gray-800">
      <h4 className="text-sm text-white font-medium mb-3">Your sleep</h4>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Wake</span>
          <span className="text-xs text-white font-semibold">{wakeTime}</span>
        </div>
        
        {/* Sleep graph */}
        <div className="relative w-full">
          <svg 
            width={width} 
            height={height} 
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id={`sleepGradient-${wakeTime}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* Area graph */}
            <path
              d={areaPath ?? undefined}
              fill={`url(#sleepGradient-${wakeTime})`}
              stroke="#60a5fa"
              strokeWidth={2}
            />
            
            {/* Base line */}
            <line
              x1={margin.left}
              y1={height - margin.bottom}
              x2={width - margin.right}
              y2={height - margin.bottom}
              stroke="#4b5563"
              strokeWidth={1}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

