import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DiscoveredDevice {
  id: string;
  name?: string;
  rssi?: number;
  [key: string]: any;
}

interface BleScanState {
  isScanning: boolean;
  devices: Record<string, DiscoveredDevice>; // Map by ID
  setIsScanning: (scanning: boolean) => void;
  addDevice: (device: DiscoveredDevice) => void;
  clearDevices: () => void;
}

const useBleScanStore = create<BleScanState>()(
  devtools((set) => ({
    isScanning: false,
    devices: {},
    setIsScanning: (isScanning) => set({ isScanning }),
    addDevice: (device) =>
      set((state) => ({
        devices: {
          ...state.devices,
          [device.id]: device,
        },
      })),
    clearDevices: () => set({ devices: {} }),
  }))
);

export default useBleScanStore;
