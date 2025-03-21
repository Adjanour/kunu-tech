import { create } from "zustand";
import firestore from "@react-native-firebase/firestore";

interface WasteStats {
  recycled_kg: number;
  correct_disposals: number;
  impact_score: number;
}

interface UserStore {
  wasteStats: WasteStats;
  fetchWasteStats: (userId: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  wasteStats: { recycled_kg: 0, correct_disposals: 0, impact_score: 0 },

  fetchWasteStats: async (userId) => {
    const userDoc = await firestore().collection("users").doc(userId).get();
    const userData = userDoc.data();
    set({
      wasteStats: userData?.waste_stats || {
        recycled_kg: 0,
        correct_disposals: 0,
        impact_score: 0,
      },
    });
  },
}));
