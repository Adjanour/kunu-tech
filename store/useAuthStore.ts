import { create } from "zustand";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { storeToken, removeToken } from "../services/api";

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "user" | "collector" | "admin";
  token: string;
  points?: number;
  level?: number;
}

interface AuthState {
  user: User | null;
  step: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: "user" | "collector" | "admin",
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserRole: () => Promise<void>;
  setUser: (user: User | null) => void;
  setStep: (step: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  step: 0,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const token = await userCredential.user.getIdToken();

      // Fetch role from Firestore
      const userDoc = await firestore()
        .collection("users")
        .doc(userCredential.user.uid)
        .get();
      if (!userDoc.exists) throw new Error("User role not found!");

      const userData = userDoc.data() as User;

      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email ?? "",
        displayName: userCredential.user.displayName ?? "New User",
        photoURL: userCredential.user.photoURL ?? "",
        role: userData.role, // Ensure role is from Firestore
        token,
      };

      await storeToken(token);
      set({ user, loading: false });
      console.log(user);
    } catch (error) {
      console.error("Login error:", error);
      set({ loading: false });
      throw error;
    }
  },

  register: async (email, password, role) => {
    set({ loading: true });
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const token = await userCredential.user.getIdToken();

      // Store new user in Firestore
      const newUser: User = {
        uid: userCredential.user.uid,
        email,
        displayName: userCredential.user.displayName || "New User",
        role,
        token,
      };

      await firestore().collection("users").doc(newUser.uid).set(newUser);
      await storeToken(token);

      set({ user: newUser, loading: false });
    } catch (error) {
      console.error("Registration error:", error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    await auth().signOut();
    await removeToken();
    set({ user: null });
  },

  fetchUserRole: async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    set({ loading: true });

    try {
      const userDoc = await firestore()
        .collection("users")
        .doc(currentUser.uid)
        .get();
      if (!userDoc.exists) throw new Error("User not found in Firestore!");

      const userData = userDoc.data() as User;
      set({ user: { ...userData, uid: currentUser.uid }, loading: false });
    } catch (error) {
      console.error("Error fetching user role:", error);
      set({ loading: false });
    }
  },

  setUser: (user) => set({ user }),
  setStep: (step) => set({ step }),
}));
