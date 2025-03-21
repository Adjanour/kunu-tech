// services/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Bin } from "../lib/types";

const API_BASE_URL = "https://kunutechbackend.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});


// Attach Token to Requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all bins
export const fetchBins = async (): Promise<Bin[]> => {
  const response = await api.get("/bins");
  console.log(response.data.bins);
  return response.data.bins;
};

// Fetch single bin details
export const fetchBinById = async (binId: string): Promise<Bin> => {
  const response = await api.get(`/bins/${binId}`);
  return response.data;
};

export const fetchCollectorBins = async (collectorId: string) => {
  const response = await api.get(`/collectors/${collectorId}/bins`);
  return response.data;
};

// Request a bin pickup (User)
export const requestPickup = async (binId: string) => {
  await api.post(`/bins/${binId}/request-pickup`);
};

// Mark a bin as collected (Collector)
export const markBinCollected = async (binId: string) => {
  await api.post(`/bins/${binId}/mark-collected`);
};

// Store Token
export const storeToken = async (token: string) => {
  await AsyncStorage.setItem("token", token);
};

// Remove Token (Logout)
export const removeToken = async () => {
  await AsyncStorage.removeItem("token");
};

// Get Token
export const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return token;
};

// Fetch all bins
export const getBins = async () => {
  const response = await api.get("/bins/");
  return response.data;
};

// Fetch nearby bins
export const getNearbyBins = async (lat: number, lon: number) => {
  const response = await api.get(`/bins/nearby?lat=${lat}&lon=${lon}`);
  return response.data;
};

// Assign pickup task
export const assignPickup = async (binId: string, collectorId: string) => {
  const response = await api.post("/bins/assign-pickup", {
    bin_id: binId,
    collector_id: collectorId,
  });
  return response.data;
};

// Fetch optimized route for collector
export const getOptimizedRoute = async (collectorId: string) => {
  const response = await api.get(`/optimized-route/${collectorId}`);
  return response.data;
};

// Fetch user waste history
export const getUserHistory = async (userId: string) => {
  const response = await api.get(`/users/${userId}/history`);
  return response.data;
};

// Send push notification
export const sendNotification = async (
  userId: string,
  title: string,
  body: string,
) => {
  const response = await api.post("/notification/send-notification", {
    uid: userId,
    title,
    body,
  });
  return response.data;
};

export const registerDeviceToken = async (userId: string, token: string) => {
  const response = await api.post("/devices/register-token", {
    uid: userId,
    token,
  });
  return response.data;
};

// Fetch all marketplace items
export const getMarketplaceItems = async () => {
  const response = await api.get("/marketplace/items");
  console.log(response.data);
  return response.data;
};

// Fetch items by category
export const getMarketplaceItemsByCategory = async (category: string) => {
  const response = await api.get(`/marketplace/items/${category}`);
  return response.data;
};

// Post a new marketplace item
export const postMarketplaceItem = async (item: any) => {
  const response = await api.post("/marketplace/item", item);
  return response.data;
};

// Update item availability (mark as sold/donated)
export const updateMarketplaceItem = async (
  itemId: string,
  available: boolean,
) => {
  const response = await api.put(
    `/marketplace/item/${itemId}?available=${available}`,
  );
  return response.data;
};

export const submitWasteDisposal = async (userId: string, binId: string) => {
  const response = await api.post(`/users/${userId}/waste-disposal`, {
    bin_id: binId,
  });
  return response.data;
};

export const getUserWasteHistory = async (userId: string) => {
  const response = await api.get(`/users/${userId}/history`);
  return response.data;
};

export const getUserGamification = async (userId: string) => {
  const response = await api.get(`/gamification/${userId}`);
  return response.data;
};

export const updateUserPoints = async (userId: string, points: number) => {
  const response = await api.post(`/gamification/update`, {
    user_id: userId,
    points,
  });
  return response.data;
};

// Fetch all available rewards
export const getAvailableRewards = async () => {
  const response = await api.get("/rewards");
  return response.data;
};

// Redeem a reward
export const redeemReward = async (userId: string, rewardId: string) => {
  const response = await api.post(`/redeem/${userId}/${rewardId}`);
  return response.data;
};

// Fetch redeemed rewards
export const getUserRedeemedRewards = async (userId: string) => {
  const response = await api.get(`/users/${userId}/redeemed-rewards`);
  return response.data;
};

// Fetch active challenges
export const getChallenges = async () => {
  const response = await api.get("/challenges");
  return response.data;
};

// Join a challenge
export const joinChallenge = async (userId: string, challengeId: string) => {
  const response = await api.post(`/challenges/join/${userId}/${challengeId}`);
  return response.data;
};

// Fetch user recycling goals
export const getUserGoals = async (userId: string) => {
  const response = await api.get(`/users/${userId}/goals`);
  return response.data;
};

// Update goal progress
export const updateGoalProgress = async (
  userId: string,
  goalId: string,
  progress: number,
) => {
  const response = await api.post(`/users/${userId}/goals/update`, {
    goal_id: goalId,
    progress,
  });
  return response.data;
};

// Fetch available collectors
export const getAvailableCollectors = async () => {
  const response = await api.get("/collectors/available");
  return response.data;
};

// Assign a new collector to an overflowed bin
export const reassignCollector = async (
  binId: string,
  newCollectorId: string,
) => {
  const response = await api.post(`/bins/reassign/${binId}/${newCollectorId}`);
  return response.data;
};
