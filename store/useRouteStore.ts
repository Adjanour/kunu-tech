import { create } from "zustand";
import { getOptimizedRoute } from "@/services/api";

interface RouteStore {
  optimizedRoute: { latitude: number; longitude: number }[];
  loading: boolean;
  fetchOptimizedRoute: (collectorId: string) => Promise<void>;
}

export const useRouteStore = create<RouteStore>((set) => ({
  optimizedRoute: [],
  loading: false,

  fetchOptimizedRoute: async (collectorId) => {
    set({ loading: true });
    try {
      const data = await getOptimizedRoute(collectorId);
      set({ optimizedRoute: data.route, loading: false });
    } catch (error) {
      console.error("Error fetching optimized route:", error);
      set({ loading: false });
    }
  },
}));
