import React, { useState, useEffect, useCallback } from 'react';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert, Platform } from 'react-native';
import base64  from 'react-native-base64';
import { TelemetryData, HealthData } from '../lib/types';
import { useBleAdvertise } from '../lib/useAdvertise';


// Custom BLE service and characteristic UUIDs
const SERVICE_UUID = '0000FF00-0000-1000-8000-00805F9B34FB';
const DATA_CHARACTERISTIC_UUID = '0000FF01-0000-1000-8000-00805F9B34FB';

interface Props {
  deviceId: string;
  setIsOnline: (isOnline: boolean) => void;
  isOnline: boolean;
  onDataReceived: (data: TelemetryData | HealthData) => void;
}

const MeshManager: React.FC<Props> = ({ deviceId, setIsOnline, isOnline, onDataReceived }) => {
  const manager = new BleManager();
  const [connectedDevices, setConnectedDevices] = useState<Map<string, Device>>(new Map());
  const [isAdvertising, setIsAdvertising] = useState(false);

  // Check internet connectivity
  const checkConnectivity = async (): Promise<boolean> => {
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected || !netInfo.isInternetReachable) return false;
      const response = await fetch('http://192.168.43.199:3000/data', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });
      return response.ok;
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

  // Start advertising as a MineMesh node
  const startAdvertising = useCallback(async () => {
    if (isAdvertising) return;
    try {
      await manager.enable();
      const advertisementData = {
        serviceUUIDs: [SERVICE_UUID],
        serviceData: { [SERVICE_UUID]: new Uint8Array([0x01]) }, // Mesh identifier
      };
      if (Platform.OS === 'android') {
        manager.
        await manager.startAdvertising(advertisementData);
      } else {
        // iOS requires peripheral mode setup
        await manager.startAdvertising({
          name: `MineMesh-${deviceId}`,
          serviceUUIDs: [SERVICE_UUID],
        });
      }
      setIsAdvertising(true);
    } catch (error) {
      console.error('Advertising failed:', error);
    }
  }, [manager, deviceId, isAdvertising]);

  // Connect to a device and setup data exchange
  const connectToDevice = async (device: Device) => {
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      setConnectedDevices((prev) => new Map(prev).set(device.id, device));

      // Subscribe to data characteristic
      await device.monitorCharacteristicForService(
        SERVICE_UUID,
        DATA_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }
          if (characteristic?.value) {
            const decoded = base64.decode(characteristic.value);
            const data: TelemetryData | HealthData = JSON.parse(decoded);
            handleReceivedData(data);
          }
        }
      );
    } catch (error) {
      console.error('Connection failed:', device.id, error);
    }
  };

  // Scan for MineMesh devices
  const joinMesh = useCallback(() => {
    manager.startDeviceScan([SERVICE_UUID], null, (error, device: Device | null) => {
      if (error) {
        Alert.alert('BLE Error', error.message);
        return;
      }
      if (device && device.name?.includes('MineMesh') && !connectedDevices.has(device.id)) {
        connectToDevice(device);
      }
    });
  }, [manager, connectedDevices]);

  // Handle received mesh data
  const handleReceivedData = async (data: TelemetryData | HealthData) => {
    if ('origin' in data && data.origin !== deviceId) {
      const updatedData = {
        ...data,
        pathway: [...(data.pathway || []), deviceId],
      };
      onDataReceived(updatedData); // Notify dashboard
      await forwardData(updatedData); // Forward to other devices
      if (isOnline) {
        await syncData(updatedData);
      } else {
        await cacheData(updatedData);
      }
    }
  };

  // Forward data to connected devices
  const forwardData = async (data: TelemetryData | HealthData) => {
    for (const [, device] of connectedDevices) {
      try {
        await device.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          DATA_CHARACTERISTIC_UUID,
          base64.encode(JSON.stringify(data))
        );
      } catch (error) {
        console.error('Forward error:', device.id, error);
      }
    }
  };

  // Sync data to Deno API
  const syncData = async (data: TelemetryData | HealthData) => {
    try {
      const endpoint = 'rssi' in data ? '/health' : '/data';
      await fetch(`http://192.168.43.199:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Sync error:', error);
      await cacheData(data);
    }
  };

  // Cache data locally
  const cacheData = async (data: TelemetryData | HealthData) => {
    const cached = JSON.parse((await AsyncStorage.getItem('cachedData')) || '[]') as any[];
    await AsyncStorage.setItem('cachedData', JSON.stringify([...cached, data]));
  };

  // Broadcast cached data when online
  const broadcastCachedData = async () => {
    if (!isOnline) return;
    const cached = JSON.parse((await AsyncStorage.getItem('cachedData')) || '[]') as any[];
    for (const data of cached) {
      await syncData(data);
    }
    await AsyncStorage.setItem('cachedData', '[]');
  };

  // Generate mock data for demo
  const generateMockData = () => {
    const data: TelemetryData = {
      deviceId,
      origin: deviceId,
      pathway: [deviceId],
      timestamp: Date.now(),
      heartRate: Math.floor(Math.random() * (120 - 80) + 80),
      status: Math.random() > 0.9 ? 'Fatigue Alert' : 'Normal',
      speed: Math.random() * 30,
      engineStatus: Math.random() > 0.5 ? 'Running' : 'Idle',
    };
    handleReceivedData(data);
    setTimeout(generateMockData, 10000); // Every 10s
  };

  useEffect(() => {
    manager.enable();
    updateOnlineStatus();
    startAdvertising();
    joinMesh();
    generateMockData(); // Start mock data for demo

    const interval = setInterval(updateOnlineStatus, 10000);
    const unsubscribe = NetInfo.addEventListener(() => updateOnlineStatus());
    broadcastCachedData();

    return () => {
      manager.stopDeviceScan();
      manager.disable();
      clearInterval(interval);
      unsubscribe();
      connectedDevices.forEach(([, device]) => device.cancelConnection());
    };
  }, [isOnline, manager, deviceId, joinMesh, startAdvertising, connectedDevices]);

  return null; // No UI
};

export default MeshManager;
