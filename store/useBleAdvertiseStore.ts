import {create} from 'zustand';
import { devtools } from 'zustand/middleware';

export interface BleAdvertisingState {
  isAdvertising: boolean;
    setIsAdvertising: (isAdvertising: boolean) => void;
}

const useBleAdvertiseStore = create<BleAdvertisingState>()(
    devtools((set) => ({
      isAdvertising: false,
      setIsAdvertising: (isAdvertising) => set({ isAdvertising }),
    }))
  );

export default useBleAdvertiseStore;

