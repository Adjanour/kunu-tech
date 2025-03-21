// useMarketplaceStore.ts
import { create } from "zustand";
import { getMarketplaceItems, postMarketplaceItem, updateMarketplaceItem } from "@/services/api";
import { Item } from "~/lib/types";

interface MarketplaceStore {
  items: Item[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  createItem: (item: Omit<Item, "id">) => Promise<void>;
  updateItem: (itemId: string, available: boolean) => Promise<void>;
}

export const useMarketplaceStore = create<MarketplaceStore>((set) => ({
  items: [],
  loading: false,

  // Fetch marketplace items
  fetchItems: async () => {
    set({ loading: true });
    try {
      const data = await getMarketplaceItems();
      set({ items: data.items || [], loading: false });
    } catch (error) {
      console.error("Error fetching items:", error);
      set({ loading: false });
    }
  },

  // Create a new marketplace item
  createItem: async (item) => {
    try {
      const newItem = await postMarketplaceItem(item);
      set((state) => ({ items: [newItem, ...state.items] }));
    } catch (error) {
      console.error("Error posting item:", error);
    }
  },

  // Update the availability of an item
  updateItem: async (itemId, available) => {
    try {
      await updateMarketplaceItem(itemId, available);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, available } : item
        ),
      }));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  },
}));