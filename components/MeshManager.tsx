// src/components/MeshManager.tsx
import React, { useState, useEffect } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { TelemetryData } from '../lib/types';

interface Props {
  deviceId: string;
  setIsOnline: (isOnline: boolean) => void;
  isOnline: boolean;
}

const MeshManager: React.FC<Props> = ({ deviceId, setIsOnline, isOnline }) => {
  const manager = new BleManager();
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);

  // Check internet and API connectivity
  const checkConnectivity = async (): Promise<boolean> => {
    try {
      // Check internet connection
      const netInfo = await NetInfo.fetch();
      console.log('Network Info:', netInfo);
      if (!netInfo.isConnected || !netInfo.isInternetReachable) {
        return false;
      }

      // Ping API
      const response = await fetch('http://192.168.43.199:3000/data', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });
      return response.ok; // True if 2xx status
    } catch (error) {
      console.log('Connectivity check failed:', error);
      return false;
    }
  };

  // Update online status
  const updateOnlineStatus = async () => {
    const online = await checkConnectivity();
    setIsOnline(online);
  };

  // Scan for BLE devices and join mesh
  const joinMesh = async () => {
    manager.startDeviceScan(null, null, (error, device: Device | null) => {
      if (error) {
        Alert.alert('BLE Error', error.message);
        return;
      }
      if (device?.name?.includes('MineMesh')) {
        setConnectedDevices((prev) => [...new Set([...prev, device.id])]);
        // Simulate receiving data (replace with GATT read in production)
        const receivedData: TelemetryData = {
          deviceId: 'node2',
          timestamp: Date.now(),
          origin: 'node2',
          pathway: ['node2'],
          heartRate: 95,
          status: 'Normal',
        };
        handleReceivedData(receivedData);
      }
    });
  };

  // Handle received mesh data
  const handleReceivedData = async (data: TelemetryData) => {
    if (data.origin !== deviceId) {
      const updatedData: TelemetryData = { ...data, pathway: [...data.pathway, deviceId] };
      if (isOnline) {
        await fetch('http://192.168.43.199:3000/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
      } else {
        const cached = JSON.parse(
          (await AsyncStorage.getItem('cachedData')) || '[]',
        ) as TelemetryData[];
        await AsyncStorage.setItem('cachedData', JSON.stringify([...cached, updatedData]));
      }
    }
  };

  // Broadcast cached data when online
  const broadcastCachedData = async () => {
    if (isOnline) {
      const cached = JSON.parse(
        (await AsyncStorage.getItem('cachedData')) || '[]',
      ) as TelemetryData[];
      for (const data of cached) {
        await fetch('http://192.168.43.199:3000/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      await AsyncStorage.setItem('cachedData', '[]');
    }
  };

  useEffect(() => {
    // Initial check
    updateOnlineStatus();
    joinMesh();

    // Periodic check every 10s
    const interval = setInterval(updateOnlineStatus, 10000);

    // Listen for network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      updateOnlineStatus();
    });

    // Broadcast cached data when online
    broadcastCachedData();

    return () => {
      manager.stopDeviceScan();
      clearInterval(interval);
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  return null; // No UI
};

export default MeshManager;