import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBinStore } from "@/store/useBinStore"; // Fetch bins
import { useAuthStore } from "~/store/useAuthStore";
import BinListComponent from "~/components/BinList";

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { bins, fetchBins, loading, error } = useBinStore();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBins(); // Load bin data
      } catch (err) {
        console.error("Failed to fetch bins:", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  if (isFetching) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#32CD32" />
        <Text>Loading Dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Failed to load data. Please try again.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.brand}>KunuTech</Text>

      {/* User Profile */}
      <View style={styles.profileCard}>
        <Image source={{ uri: user?.photoURL || "https://via.placeholder.com/50" }} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>{user?.displayName || "Guest"}</Text>
          <Text style={styles.userPoints}>
            💰 {user?.points || 0} pts • 🔥 Level {user?.level || 1}
          </Text>
        </View>
      </View>

      {/* Scan Button */}
      <TouchableOpacity style={styles.scanButton}>
        <Text style={styles.scanText}>♻️ Scan to Recycle</Text>
      </TouchableOpacity>

      {/* Quick Access */}
      <View style={styles.quickAccess}>
        <QuickAccessButton icon="location-outline" text="Nearby Bins" onPress={() => console.log("Nearby Bins")} />
        <QuickAccessButton icon="gift-outline" text="Rewards" onPress={() => console.log("Rewards")} />
        <QuickAccessButton icon="time-outline" text="History" onPress={() => console.log("History")} />
        <QuickAccessButton icon="cart-outline" text="Market" onPress={() => console.log("Market")} />
      </View>

      {/* Nearby Bins */}
      <BinListComponent bins={bins}  />
    </SafeAreaView>
  );
}

const QuickAccessButton = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.quickButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color="black" />
    <Text style={styles.quickText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FCFB" },
  brand: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F7FF",
    padding: 15,
    borderRadius: 8,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userPoints: { fontSize: 14, color: "gray" },
  scanButton: {
    backgroundColor: "#32CD32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  scanText: { color: "white", fontSize: 18, fontWeight: "bold" },
  quickAccess: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  quickButton: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: 80,
  },
  quickText: { fontSize: 12, marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", textAlign: "center" },
});