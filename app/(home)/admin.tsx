import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function HomeScreen() {
  const { user, fetchUserRole } = useAuthStore();

  useEffect(() => {
    fetchUserRole();
    if (user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "collector") {
        router.replace("/(app)/(drawer)/(collector)");
      } else {
        router.replace("/(app)/(drawer)/(user)/(tabs)");
      }
    }
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="green" />
    </View>
  );
}
