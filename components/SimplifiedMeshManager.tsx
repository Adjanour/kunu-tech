// components/SimplifiedMeshManager.tsx
import React, { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { TelemetryData, HealthData, DeviceType } from '../lib/types';
import { useMeshNetwork, MeshNode } from '../lib/useMeshNetwork';

interface Props {
  deviceId: string;
  deviceType: DeviceType;
  setIsOnline: (isOnline: boolean) => void;
  isOnline: boolean;
  onDataReceived?: (data: TelemetryData | HealthData) => void;
}

const SimplifiedMeshManager: React.FC<Props> = ({ 
  deviceId, 
  deviceType,
  setIsOnline, 
  isOnline,
  onDataReceived 
}) => {
  // Use the comprehensive mesh network hook
  const {
    isOnline: meshIsOnline,
    isScanning,
    isAdvertising,
    meshNodes,
    stats,
    broadcastData,
    getConnectedNodes,
    getMeshStats,
  } = useMeshNetwork({
    deviceId,
    deviceType,
    onDataReceived: useCallback((data: TelemetryData | HealthData, fromNode?: string) => {
      console.log(`Data received from mesh node ${fromNode}:`, data);
      onDataReceived?.(data);
    }, [onDataReceived]),
    onNodeConnected: useCallback((node: MeshNode) => {
      console.log(`Mesh node connected: ${node.name} (${node.deviceType})`);
      // Optionally show notification to user
    }, []),
    onNodeDisconnected: useCallback((nodeId: string) => {
      console.log(`Mesh node disconnected: ${nodeId}`);
    }, []),
    serverEndpoint: 'http://192.168.43.199:3000'
  });

  // Sync online status with parent component
  useEffect(() => {
    setIsOnline(meshIsOnline);
  }, [meshIsOnline, setIsOnline]);

  // Generate mock data for demonstration
  const generateMockData = useCallback(() => {
    if (deviceType === 'Human') {
      const data: TelemetryData = {
        deviceId,
        origin: deviceId,
        pathway: [deviceId],
        timestamp: Date.now(),
        heartRate: Math.floor(Math.random() * (120 - 60) + 60),
        status: Math.random() > 0.9 ? 'Fatigue Alert' : 'Normal',
      };
      return data;
    } else {
      const data: TelemetryData = {
        deviceId,
        origin: deviceId,
        pathway: [deviceId],
        timestamp: Date.now(),
        speed: Math.random() * 60, // 0-60 km/h
        engineStatus: Math.random() > 0.8 ? 'Fault' : 'OK',
      };
      return data;
    }
  }, [deviceId, deviceType]);

  // Broadcast mock data periodically for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const mockData = generateMockData();
      broadcastData(mockData);
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [generateMockData, broadcastData]);

  // Log mesh statistics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const currentStats = getMeshStats();
      console.log('Mesh Network Stats:', {
        connectedNodes: currentStats.connectedNodes,
        totalDiscovered: currentStats.totalNodesDiscovered,
        messagesReceived: currentStats.messagesReceived,
        messagesSent: currentStats.messagesSent,
        dataForwarded: currentStats.dataForwarded,
        isOnline: currentStats.isOnline,
        isAdvertising: currentStats.isAdvertising,
        isScanning: currentStats.isScanning,
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [getMeshStats]);

  // Show alerts for important mesh events
  useEffect(() => {
    if (getConnectedNodes().length > 0 && !isOnline) {
      // We have mesh connections but no internet
      console.log('Mesh network active - data will be cached until internet connection is restored');
    }
  }, [getConnectedNodes, isOnline]);

  // This component doesn't render anything - it's just for mesh management
  return null;
};

export default SimplifiedMeshManager;

// Export a function to manually broadcast data from other components
export const createMeshBroadcaster = (broadcastData: (data: TelemetryData | HealthData) => Promise<void>) => {
  return {
    broadcastTelemetry: async (data: Omit<TelemetryData, 'timestamp'>) => {
      await broadcastData({
        ...data,
        timestamp: Date.now(),
      });
    },
    broadcastHealth: async (data: Omit<HealthData, 'timestamp'>) => {
      await broadcastData({
        ...data,
        timestamp: Date.now(),
      });
    }
  };
};