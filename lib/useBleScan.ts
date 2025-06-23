import { useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager'; // or your BLE lib
import useBleScanStore from '~/store/useBleScanStore';

const requiredPermissions = [
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ...(Number(Platform.Version) >= 31
    ? [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]
    : []),
];

export const useBleScan = () => {
  const { isScanning, setIsScanning, addDevice, clearDevices } = useBleScanStore();

  const askPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') return true;
    const result = await PermissionsAndroid.requestMultiple(requiredPermissions);
    return requiredPermissions.every(
      (perm) => result[perm] === PermissionsAndroid.RESULTS.GRANTED
    );
  }, []);

  const startScan = useCallback(async () => {
    const granted = await askPermissions();
    if (!granted) return;

    try {
      clearDevices();
      setIsScanning(true);

      BleManager.scan([], 5, true).then(() => {
        console.log('Scanning started');
      });

      const listener = BleManager.on('BleManagerDiscoverPeripheral', (device) => {
        addDevice({
          id: device.id,
          name: device.name || device.advertising?.localName,
          rssi: device.rssi,
        });
      });

      setTimeout(() => {
        setIsScanning(false);
        BleManager.stopScan();
        listener.remove();
      }, 5000);
    } catch (err) {
      console.error('Scan error:', err);
      setIsScanning(false);
    }
  }, [askPermissions, addDevice, clearDevices, setIsScanning]);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    BleManager.stopScan().catch(console.error);
  }, [setIsScanning]);

  return {
    isScanning,
    startScan,
    stopScan,
  };
};
