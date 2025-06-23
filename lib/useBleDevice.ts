import { useCallback } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import useBleConnectStore from '~/store/useBleConnectStore';

const bleManager = new BleManager();

export const useBleDevice = () => {
  const deviceId = useBleConnectStore((s) => s.connectedDeviceId);

  const readCharacteristic = useCallback(async (serviceUUID: string, charUUID: string) => {
    if (!deviceId) throw new Error('Device not connected');

    const device = await bleManager.devices([deviceId]);
    return await device[0].readCharacteristicForService(serviceUUID, charUUID);
  }, [deviceId]);

  const writeCharacteristic = useCallback(async (serviceUUID: string, charUUID: string, value: string) => {
    if (!deviceId) throw new Error('Device not connected');

    const device = await bleManager.devices([deviceId]);
    return await device[0].writeCharacteristicWithResponseForService(serviceUUID, charUUID, value);
  }, [deviceId]);

  const monitorCharacteristic = useCallback((serviceUUID: string, charUUID: string, callback: (value: string) => void) => {
    if (!deviceId) return;

    bleManager.monitorCharacteristicForDevice(
      deviceId,
      serviceUUID,
      charUUID,
      (error, characteristic) => {
        if (error) {
          console.error('Monitoring error:', error);
          return;
        }
        if (characteristic?.value) {
          callback(characteristic.value);
        }
      }
    );
  }, [deviceId]);

  return {
    readCharacteristic,
    writeCharacteristic,
    monitorCharacteristic,
  };
};
