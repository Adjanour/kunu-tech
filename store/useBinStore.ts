import { create } from "zustand";
import {
  fetchBins,
  getBins,
  getNearbyBins,
  getOptimizedRoute,
} from "@/services/api";
import firestore from "@react-native-firebase/firestore";
import { Bin } from "~/lib/types";

interface BinStore {
  bins: Bin[];
  loading: boolean;
  error: unknown;
  fetchBins: () => Promise<void>;
  fetchNearbyBins: (lat: number, lon: number) => Promise<void>;
  fetchOptimizedRoute: (collectorId: string) => Promise<void>;
  subscribeToBins: () => void;
}

export const useBinStore = create<BinStore>((set) => ({
  bins: [],
  loading: false,
  error: null,

  fetchBins: async () => {
    set({ loading: true });
    try {
      const data = await fetchBins();
      set({ bins: data, loading: false });
    } catch (error) {
      set({ error });
      console.error("Error fetching bins:", error);
      set({ loading: false });
    }
  },

  fetchNearbyBins: async (lat, lon) => {
    set({ loading: true });
    try {
      const data = await getNearbyBins(lat, lon);
      set({ bins: data.bins, loading: false });
    } catch (error) {
      console.error("Error fetching nearby bins:", error);
      set({ loading: false });
    }
  },

  fetchOptimizedRoute: async (collectorId) => {
    set({ loading: true });
    try {
      const data = await getOptimizedRoute(collectorId);
      set({ bins: data.optimized_route, loading: false });
    } catch (error) {
      console.error("Error fetching optimized route:", error);
      set({ loading: false });
    }
  },
  subscribeToBins: () => {
    set({ loading: true });

    const binsRef = firestore().collection("bins");

    return binsRef.onSnapshot((snapshot) => {
      const updatedBins = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Bin[];

      // Detect bin overflow
      updatedBins.forEach((bin) => {
        if (bin.fillLevel === "full") {
          // assignCollector(bin.id);
        }
      });

      set({ bins: updatedBins, loading: false });
    });
  },
}));
