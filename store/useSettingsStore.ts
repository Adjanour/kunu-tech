import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Define the store interface
interface SettingsState {
  isGuest: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  locationServices: boolean;
  language: string;
  userId: string | null;
  setGuest: (isGuest: boolean) => void;
  toggleNotifications: () => void;
  toggleDarkMode: () => void;
  toggleLocationServices: () => void;
  setLanguage: (lang: string) => void;
  loadUserSettings: (userId: string) => Promise<void>;
  updateUserSettings: () => Promise<void>;
}

// Zustand store with persistence (except guest settings)
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      isGuest: true,  // Default: Guest User (not persisted)
      notificationsEnabled: true, 
      darkMode: false,
      locationServices: true,
      language: "English",
      userId: null,  // Only set when a user logs in

      setGuest: (isGuest) => set({ isGuest }),

      toggleNotifications: () => {
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled }));
        if (!get().isGuest) get().updateUserSettings();  // Sync with API if logged in
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
        if (!get().isGuest) get().updateUserSettings();
      },

      toggleLocationServices: () => {
        set((state) => ({ locationServices: !state.locationServices }));
        if (!get().isGuest) get().updateUserSettings();
      },

      setLanguage: (lang) => {
        set({ language: lang });
        if (!get().isGuest) get().updateUserSettings();
      },

      // Load settings from API
      loadUserSettings: async (userId) => {
        try {
          const response = await axios.get(`/api/users/profile/${userId}`);
          if (response.data) {
            set({
              isGuest: false,
              userId,
              notificationsEnabled: response.data.notificationsEnabled,
              darkMode: response.data.darkMode,
              locationServices: response.data.locationServices,
              language: response.data.language,
            });
          }
        } catch (error) {
          console.error("Failed to load user settings:", error);
        }
      },

      // Update settings to API
      updateUserSettings: async () => {
        const { userId, notificationsEnabled, darkMode, locationServices, language } = get();
        if (!userId) return;

        try {
          await axios.post("/api/users/profile", {
            uid: userId,
            notificationsEnabled,
            darkMode,
            locationServices,
            language,
          });
        } catch (error) {
          console.error("Failed to update user settings:", error);
        }
      },
    }),
    {
      name: "settings-storage",
      partialize: (state) => (state.isGuest ? {} : state), // Don't persist guest settings
    }
  )
);
