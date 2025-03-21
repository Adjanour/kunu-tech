import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api'; // Assuming you have an Axios instance for API calls

// Define types for challenges
type Challenge = {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: 'active' | 'completed';
};

type ChallengesState = {
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  featuredChallenges: Challenge[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchActiveChallenges: () => Promise<void>;
  fetchCompletedChallenges: () => Promise<void>;
  fetchFeaturedChallenges: () => Promise<void>;
  joinChallenge: (userId: string, challengeId: string) => Promise<void>;
};

export const useChallengesStore = create<ChallengesState>()(
  persist(
    (set, get) => ({
      activeChallenges: [],
      completedChallenges: [],
      featuredChallenges: [],
      loading: false,
      error: null,

      // Fetch Active Challenges
      fetchActiveChallenges: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('/api/challenges/', { params: { limit: 100 } });
          const challenges = response.data.active || [];
          set({ activeChallenges: challenges });
        } catch (err) {
          console.error('Failed to fetch active challenges:', err);
          set({ error: 'Failed to load active challenges.' });
        } finally {
          set({ loading: false });
        }
      },

      // Fetch Completed Challenges
      fetchCompletedChallenges: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('/api/challenges/', { params: { limit: 100 } });
          const challenges = response.data.completed || [];
          set({ completedChallenges: challenges });
        } catch (err) {
          console.error('Failed to fetch completed challenges:', err);
          set({ error: 'Failed to load completed challenges.' });
        } finally {
          set({ loading: false });
        }
      },

      // Fetch Featured Challenges
      fetchFeaturedChallenges: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('/api/challenges/', { params: { limit: 100 } });
          const challenges = response.data.featured || [];
          set({ featuredChallenges: challenges });
        } catch (err) {
          console.error('Failed to fetch featured challenges:', err);
          set({ error: 'Failed to load featured challenges.' });
        } finally {
          set({ loading: false });
        }
      },

      // Join a Challenge
      joinChallenge: async (userId: string, challengeId: string) => {
        set({ loading: true, error: null });
        try {
          await api.post(`/api/challenges/join/${userId}/${challengeId}`);
          // Update the active challenges list after joining
          const activeChallenges = get().activeChallenges.filter((challenge) => challenge.id !== challengeId);
          set({ activeChallenges });
        } catch (err) {
          console.error('Failed to join challenge:', err);
          set({ error: 'Failed to join the challenge.' });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'challenges-store', // Persist the store in localStorage
    }
  )
);