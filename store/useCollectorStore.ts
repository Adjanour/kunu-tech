// useCollectorStore.ts
import { create } from "zustand";
import { Bin } from "~/lib/types";
import { api } from "~/services/api";



type RouteCoordinate = [number, number]; // [longitude, latitude]

type CollectorState = {
  bins: Bin[];
  route: RouteCoordinate[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchNearbyBins: (lat: number, lon: number, radius?: number) => Promise<void>;
  fetchOptimizedRoute: (collectorId: string) => Promise<void>;
  updateBinFillLevel: (binId: string, fillLevel: number) => Promise<void>;
};

export const useCollectorStore = create<CollectorState>((set) => ({
  bins: [],
  route: [],
  loading: false,
  error: null,

  // Fetch nearby bins
  fetchNearbyBins: async (lat: number, lon: number, radius: number = 5) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<{ [key: string]: Bin[] }>("/api/bins/nearby", {
        params: { lat, lon, radius },
      });

      // Flatten the bins array from the response
      const bins = Object.values(response.data).flat();
      set({ bins });
    } catch (err) {
      console.error("Failed to fetch nearby bins:", err);
      set({ error: "Failed to load nearby bins." });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch optimized route
  fetchOptimizedRoute: async (collectorId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<{ route: RouteCoordinate[] }>(
        `/api/optimized-route/${collectorId}`
      );
      set({ route: response.data.route }); // Assuming the API returns coordinates
    } catch (err) {
      console.error("Failed to fetch optimized route:", err);
      set({ error: "Failed to load optimized route." });
    } finally {
      set({ loading: false });
    }
  },

  // Update bin fill level
  updateBinFillLevel: async (binId: string, fillLevel: number) => {
    try {
      await api.post("/api/bins/bins/update", null, {
        params: { bin_id: binId, fill_level: fillLevel },
      });

      // Trigger notification if bin is full
      if (fillLevel >= 100) {
        const collectorId = "assigned_collector_id"; // Replace with dynamic logic
        await api.post("/api/notification/send-notification", null, {
          params: {
            uid: collectorId,
            title: "Bin Full Alert",
            body: `Bin ${binId} is full and needs collection.`,
            screen: "CollectionRouteScreen",
          },
        });
      }
    } catch (err) {
      console.error("Failed to update bin fill level:", err);
    }
  },
}));