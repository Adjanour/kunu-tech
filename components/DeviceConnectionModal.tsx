import { Scan, ScanFace } from "lucide-react-native";
import React, { FC, useCallback, useState, useEffect } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Device } from "react-native-ble-plx";
import useBLE from "~/lib/useBLE";

const DeviceModal: FC<{ visible: boolean; closeModal: () => void }> = ({
  visible,
  closeModal,
}) => {
  const {
    allDevices,
    connectToDevice,
    scanForPeripherals,
    connectedDevice,
    readRSSI,
  } = useBLE();
  const [rssi, setRssi] = useState<number | null>(null);

  useEffect(() => {
    scanForPeripherals();
    if (connectedDevice) {
      const interval = setInterval(async () => {
        const newRssi = await readRSSI();
        setRssi(newRssi);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [connectedDevice]);

  const calculateDistance = (rssi: number) => {
    const txPower = -59; // Adjust based on your BLE device
    return Math.pow(10, (txPower - rssi) / (10 * 2)); // 2 is the path-loss exponent
  };

  const handleConnect = (device: Device) => {
    connectToDevice(device);
    closeModal();
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Tap on a device to connect</Text>
        <FlatList
          contentContainerStyle={styles.modalFlatlistContainer}
          data={allDevices}
          keyExtractor={(device) => device.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleConnect(item)}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>
                {item.name || "Unknown Device"}
              </Text>
            </TouchableOpacity>
          )}
        />
        {connectedDevice && rssi !== null && (
          <View style={styles.proximityContainer}>
            <Text style={styles.proximityText}>Proximity: {rssi} dBm</Text>
            <Text style={styles.proximityText}>
              Estimated Distance: {calculateDistance(rssi).toFixed(2)} meters
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalFlatlistContainer: {
    flex: 1,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  proximityContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  proximityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});

export default DeviceModal;
