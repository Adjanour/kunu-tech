// services/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Store Token
export const storeToken = async (token: string) => {
  await AsyncStorage.setItem("token", token);
};

// Remove Token (Logout)
export const removeToken = async () => {
  await AsyncStorage.removeItem("token");
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
