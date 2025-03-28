import { useState, useEffect } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";

const bleManager = new BleManager();

export default function useBLE() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const scanForPeripherals = async () => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) return;
      if (device && device.name) {
        setAllDevices((prev) => {
          if (!prev.some((d) => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    setTimeout(() => bleManager.stopDeviceScan(), 10000); // Stop scanning after 10s
  };

  const connectToDevice = async (device: Device) => {
    try {
      const connected = await bleManager.connectToDevice(device.id);
      setConnectedDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
    } catch (error) {
      console.error("Connection failed", error);
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
    }
  };

  const readRSSI = async () => {
    if (connectedDevice) {
      try {
        const rssi = await connectedDevice.readRSSI();
        return rssi;
      } catch (error) {
        console.error("Error reading RSSI", error);
        return null;
      }
    }
    return null;
  };

  return {
    allDevices,
    connectedDevice,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    readRSSI,
  };
}
