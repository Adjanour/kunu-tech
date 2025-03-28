import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { Scan } from "lucide-react-native";

const bleManager = new BleManager();

const discoverDevices = async (): Promise<Device[]> => {
  try {
    const devices = await RNBluetoothClassic.startDiscovery();
    console.log("🔍 Found devices:", devices);
    return devices;
  } catch (error) {
    console.error("⚠️ Discovery error:", error);
    return [];
  }
};

const connectToDevice = async (deviceId: string) => {
  try {
    const device = await RNBluetoothClassic.connectToDevice(deviceId);
    console.log(`🔗 Connected to ${device.name}`);
  } catch (error) {
    console.error("⚠️ Connection failed:", error);
  }
};

const DeviceList = ({ devices }: { devices: Device[] }) => (
  <FlatList
    data={devices}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.deviceItem}
        onPress={() => connectToDevice(item.id)}
      >
        <Text style={styles.deviceName}>{item.name || "Unknown Device"}</Text>
        <Text style={styles.deviceId}>{item.id}</Text>
      </TouchableOpacity>
    )}
  />
);

const DeviceTrackerScreen = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  const scanForDevices = useCallback(() => {
    setDevices([]); // Clear old results before scanning
    bleManager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.error("⚠️ Scan error:", error);
          return;
        }
        if (!device || devices.find((d) => d.id === device.id)) return;

        setDevices((prev) => [...prev, device]);
        console.log(`📡 Found device: ${device.name} (${device.id})`);
      },
    );

    setTimeout(() => {
      bleManager.stopDeviceScan();
      console.log("⏹️ Scan stopped.");
    }, 10000); // Stop scanning after 10 seconds
  }, [devices]);

  const startDiscovery = async () => {
    const foundDevices = await discoverDevices();
    setDevices(foundDevices);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📡 Tracked Devices</Text>
      <DeviceList devices={devices} />
      <View style={styles.buttonContainer}>
        <Button title="Scan BLE Devices" onPress={scanForDevices} />
        <Button title="Scan Classic Devices" onPress={startDiscovery} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  deviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deviceId: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 16,
    gap: 8,
  },
});

export default DeviceTrackerScreen;
