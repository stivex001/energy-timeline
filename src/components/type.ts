export interface EnergyPoint {
  id: number;
  time: string;
  level: number;
}

export interface EnergyHighlight {
  time: string;
  label: string;
  color: string;
}

export interface TimelineMessage {
  title: string;
  description: string;
}

export type EnergyTimelineProps = {
  data: EnergyPoint[];
  highlights: EnergyHighlight[];
  currentTime: string;
  message: TimelineMessage;
};
