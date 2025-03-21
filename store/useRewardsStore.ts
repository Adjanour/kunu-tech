import { create } from "zustand";
import { getAvailableRewards, redeemReward, getUserRedeemedRewards } from "@/services/api";

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image_url: string;
}

interface RewardsStore {
  rewards: Reward[];
  redeemedRewards: Reward[];
  loading: boolean;
  fetchRewards: () => Promise<void>;
  fetchRedeemedRewards: (userId: string) => Promise<void>;
  redeem: (userId: string, rewardId: string) => Promise<void>;
}

export const useRewardsStore = create<RewardsStore>((set) => ({
  rewards: [],
  redeemedRewards: [],
  loading: false,

  fetchRewards: async () => {
    set({ loading: true });
    try {
      const data = await getAvailableRewards();
      set({ rewards: data.rewards, loading: false });
    } catch (error) {
      console.error("Error fetching rewards:", error);
      set({ loading: false });
    }
  },

  fetchRedeemedRewards: async (userId) => {
    set({ loading: true });
    try {
      const data = await getUserRedeemedRewards(userId);
      set({ redeemedRewards: data.redeemedRewards, loading: false });
    } catch (error) {
      console.error("Error fetching redeemed rewards:", error);
      set({ loading: false });
    }
  },

  redeem: async (userId, rewardId) => {
    try {
      await redeemReward(userId, rewardId);
      set((state) => ({
        rewards: state.rewards.filter((reward) => reward.id !== rewardId),
      }));
    } catch (error) {
      console.error("Error redeeming reward:", error);
    }
  },
}));
