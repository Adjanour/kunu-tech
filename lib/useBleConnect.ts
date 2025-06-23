import { useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import useBleConnectStore from '~/store/useBleConnectStore';

const bleManager = new BleManager();

export const useBleConnect = () => {
  const {
    isConnecting,
    setIsConnecting,
    setConnectedDeviceId,
    setServices,
    reset,
  } = useBleConnectStore();

  const connectToDevice = useCallback(async (deviceId: string) => {
    setIsConnecting(true);

    try {
      const device = await bleManager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();

      const services = await device.services();
      setConnectedDeviceId(device.id);
      setServices(services);
    } catch (error) {
      console.error('Connection failed:', error);
      reset();
    } finally {
      setIsConnecting(false);
    }
  }, [setIsConnecting, setConnectedDeviceId, setServices, reset]);

  const disconnectDevice = useCallback(async () => {
    const id = useBleConnectStore.getState().connectedDeviceId;
    if (!id) return;

    try {
      await bleManager.cancelDeviceConnection(id);
    } catch (err) {
      console.warn('Disconnection failed or device already disconnected', err);
    } finally {
      reset();
    }
  }, [reset]);

  return {
    isConnecting,
    connectToDevice,
    disconnectDevice,
  };
};
