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
  cachedAt?: number;
}

export interface HealthData {
  deviceId: string;
  timestamp: number;
  rssi: number;
  latency: number;
  cachedAt?: number;
}
