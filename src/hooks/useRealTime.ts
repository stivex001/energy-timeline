import { useState, useEffect } from "react";

export const useRealTime = (updateInterval: number = 60000) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    setCurrentTime(new Date());

    // Set up interval to update every minute (or specified interval)
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return currentTime;
};

