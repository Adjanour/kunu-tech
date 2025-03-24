import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";

// Mock QR Scanner Component
const QRScanner = ({ onDetect }) => {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setScanning(false);
      onDetect("MOCK_QR_CODE_12345"); // Simulate QR detection
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onDetect]);

  return (
    <View className="flex-1 items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      {scanning ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Text className="text-lg text-green-500">QR Code Detected!</Text>
      )}
      <Text className="text-gray-500 mt-2">
        Align the QR code within the frame
      </Text>
    </View>
  );
};

// Mock Bluetooth Scanner Component
const BluetoothScanner = ({ onSelect }) => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDevices([
        { id: "BT_01", name: "Device 1" },
        { id: "BT_02", name: "Device 2" },
      ]);
      setScanning(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="flex-1 p-4">
      {scanning ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <View>
          {devices.map((device) => (
            <Pressable
              key={device.id}
              className="p-3 bg-gray-200 dark:bg-gray-800 rounded-lg my-2 flex flex-row items-center"
              onPress={() => onSelect(device.id)}
            >
              <Feather name="bluetooth" size={20} color="black" />
              <Text className="ml-3 text-black dark:text-white">
                {device.name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export { QRScanner, BluetoothScanner };
