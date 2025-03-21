import { create } from "zustand";
import firestore from "@react-native-firebase/firestore";

interface DashboardStore {
  userStats: any;
  loading: boolean;
  fetchUserStats: (userId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  userStats: {},
  loading: false,

  fetchUserStats: async (userId) => {
    set({ loading: true });
    const doc = await firestore().collection("users").doc(userId).get();
    set({ userStats: doc.data(), loading: false });
  },
}));
