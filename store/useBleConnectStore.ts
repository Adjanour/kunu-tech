import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BleConnectionState {
  connectedDeviceId: string | null;
  isConnecting: boolean;
  services: any[]; // replace with proper type if needed
  setIsConnecting: (connecting: boolean) => void;
  setConnectedDeviceId: (id: string | null) => void;
  setServices: (services: any[]) => void;
  reset: () => void;
}

const useBleConnectStore = create<BleConnectionState>()(
  devtools((set) => ({
    connectedDeviceId: null,
    isConnecting: false,
    services: [],
    setIsConnecting: (isConnecting) => set({ isConnecting }),
    setConnectedDeviceId: (connectedDeviceId) => set({ connectedDeviceId }),
    setServices: (services) => set({ services }),
    reset: () => set({ connectedDeviceId: null, isConnecting: false, services: [] }),
  }))
);

export default useBleConnectStore;
