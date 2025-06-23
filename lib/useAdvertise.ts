import { useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import BleAdvertise from 'react-native-ble-advertise';
import useBleAdvertiseStore from '~/store/useBleAdvertiseStore';

const COMPANY_ID = '0x00E0';
const UUID = '44C13E43-097A-9C9F-537F-5666A6840C08';
const MAJOR = '1234';
const MINOR = '4321';

const permissionsRequired = [
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ...(Number(Platform.Version) >= 31
    ? [PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE]
    : []),
];

export const useAdvertise = (deviceId: string) => {
  const isAdvertising = useBleAdvertiseStore((state) => state.isAdvertising);
  const setIsAdvertising = useBleAdvertiseStore((state) => state.setIsAdvertising);

  const askForPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') return true;

    const result = await PermissionsAndroid.requestMultiple(permissionsRequired);
    const allGranted = permissionsRequired.every(
      (perm) => result[perm] === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      console.log('Not all permissions granted:', result);
    }

    return allGranted;
  }, []);

  const startAdvertising = useCallback(async () => {
    const granted = await askForPermissions();
    if (!granted) return;

    try {
      BleAdvertise.setCompanyId(parseInt(COMPANY_ID, 16));
      await BleAdvertise.broadcast(UUID, parseInt(MAJOR, 16), parseInt(MINOR, 16));
      setIsAdvertising(true);
    } catch (err) {
      console.error('BLE Advertising failed:', err);
      setIsAdvertising(false);
    }
  }, [askForPermissions, setIsAdvertising]);

  const stopAdvertising = useCallback(async () => {
    try {
      await BleAdvertise.stopBroadcast();
    } catch (err) {
      console.error('Failed to stop BLE advertising:', err);
    } finally {
      setIsAdvertising(false);
    }
  }, [setIsAdvertising]);

  return {
    isAdvertising,
    startAdvertising,
    stopAdvertising,
  };
};
