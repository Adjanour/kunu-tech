export type DeviceType = 'Vehicle' | 'Human';

export interface TelemetryData {
  deviceId: string;
  timestamp: number;
  origin: string;
  pathway: string[];
  heartRate?: number;
  status?: 'Normal' | 'Fatigue Alert';
  speed?: number;
  engineStatus?: string;
}

export interface HealthData {
  deviceId: string;
  timestamp: number;
  rssi: number;
  latency: number;
}
