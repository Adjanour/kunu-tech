import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore"; // Fetch waste stats
import { useChallengesStore } from "@/store/useChallengesStore"; // Fetch challenges
import { router } from "expo-router";

export default function UserDashboard() {
  const { user } = useAuthStore();
  const { wasteStats, fetchWasteStats, error: wasteStatsError } = useUserStore();
  const { challenges, fetchChallenges, error: challengesError } = useChallengesStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.uid) {
          await fetchWasteStats(user.uid);
        }
        await fetchChallenges();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  if (loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  // Handle errors
  if (wasteStatsError || challengesError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load data. Please try again later.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🌍 Welcome, {user.displayName}!</Text>
      <Text style={styles.subtitle}>Your Sustainability Progress</Text>

      <ScrollView contentContainerStyle={styles.section}>
        {/* Waste Tracking Stats */}
        <View style={styles.card}>
          <Text style={styles.header}>♻️ Waste Tracking</Text>
          {wasteStats.recycled_kg !== undefined ? (
            <>
              <Text>Total Waste Recycled: {wasteStats.recycled_kg} kg</Text>
              <Text>Correct Disposals: {wasteStats.correct_disposals}</Text>
              <Text>Impact Score: {wasteStats.impact_score}</Text>
            </>
          ) : (
            <Text>No waste data available yet.</Text>
          )}
        </View>

        {/* Community Challenges */}
        <View style={styles.card}>
          <Text style={styles.header}>🏆 Active Challenges</Text>
          {challenges.length > 0 ? (
            challenges.map((challenge) => (
              <TouchableOpacity
                key={challenge.id}
                style={styles.challengeCard}
                onPress={() => router.push(`/challenges/${challenge.id}`)}
              >
                <Text>{challenge.title}</Text>
                <Text>Points: {challenge.points}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No active challenges available.</Text>
          )}
        </View>

        {/* Leaderboard & Gamification */}
        <View style={styles.card}>
          <Text style={styles.header}>🎮 Gamification</Text>
          <Text>Leaderboard Rank: #{wasteStats.leaderboard_rank || "N/A"}</Text>
          <Text>Earned Badges: 🏅🏅🏅</Text>
        </View>

        {/* Circular Economy */}
        <View style={styles.card}>
          <Text style={styles.header}>🔄 Circular Economy</Text>
          <TouchableOpacity
            style={styles.marketplaceButton}
            onPress={() => router.push("/marketplace")}
            accessibilityLabel="Explore Marketplace"
          >
            <Text style={styles.buttonText}>Explore Marketplace</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code Scanner */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push("/qrscanner")}
          accessibilityLabel="Scan QR to Dispose Waste"
        >
          <Text style={styles.buttonText}>Scan QR to Dispose Waste</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  section: { paddingBottom: 20 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  challengeCard: {
    backgroundColor: "#e6f7ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  marketplaceButton: {
    backgroundColor: "#006400",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
});