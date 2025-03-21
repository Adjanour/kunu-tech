// types.ts
export type Bin = {
  id: string;
  name:string;
  latitude: number;
  longitude: number;
  address?: string;
  distance?: number;
  fillLevel: "empty" | "half-full" | "full";
  fillLevelPercentage?: number;
  lastCollection: string;
  wasteType: "plastic" | "organic" | "e-waste" | "general";
};

export type User = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "collector";
  token?: string;
};

export type Item = {
  id: string;
  title: string;
  points: number;
  description: string;
  seller: string;
  isNew: boolean;
  imageUrl: string;
  postedAgo: string;
};

// types.ts
export type Reward = {
  id: string;
  title: string;
  description: string;
  type: "badge" | "level" | "points"; // Example types
  value: number; // Points or level
  earnedAt: string; // Date when the reward was earned
};

export type GamificationState = {
  rewards: Reward[];
  loading: boolean;
  error: string | null;
};