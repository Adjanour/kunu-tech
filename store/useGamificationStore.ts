// useGamificationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/services/api";

// Define types for the store state
export type Reward = {
  id: string;
  title: string;
  description: string;
  type: "badge" | "level" | "points"; // Example types
  value: number; // Points or level
  earnedAt: string; // Date when the reward was earned
};

type GamificationState = {
  rewards: Reward[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchRewards: (userId: string) => Promise<void>;
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      rewards: [],
      loading: false,
      error: null,

      // Fetch user rewards
      fetchRewards: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get<{ rewards: Reward[] }>(
            `/api/gamification/gamification/${userId}`
          );

          // Update the store with fetched rewards
          set({ rewards: response.data.rewards || [] });
        } catch (err) {
          console.error("Failed to fetch rewards:", err);
          set({ error: "Failed to load rewards." });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "gamification-store", // Persist the store in localStorage
    }
  )
);

// Expose fetchRewards for external use
export const useFetchRewards = () => {
  const { fetchRewards } = useGamificationStore();
  return fetchRewards;
};