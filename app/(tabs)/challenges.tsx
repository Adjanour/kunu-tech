import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useChallengesStore } from "@/store/useChallengesStore";

export default function ChallengesScreen() {
  const {
    activeChallenges,
    completedChallenges,
    featuredChallenges,
    fetchActiveChallenges,
    fetchCompletedChallenges,
    fetchFeaturedChallenges,
    joinChallenge,
    loading,
    error,
  } = useChallengesStore();
  const [tab, setTab] = useState("Active");

  // Fetch data on component mount
  useEffect(() => {
    fetchActiveChallenges();
    fetchCompletedChallenges();
    fetchFeaturedChallenges();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Challenges</Text>
      <Text style={styles.subtitle}>Complete challenges and earn points</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setTab("Active")} style={[styles.tab, tab === "Active" && styles.activeTab]}>
          <Text style={styles.tabText}>Active Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("Completed")} style={[styles.tab, tab === "Completed" && styles.activeTab]}>
          <Text style={styles.tabText}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && <ActivityIndicator size="large" color="#26C165" />}

      {/* Error State */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Content Based on Tab */}
      {tab === "Active" && (
        <>
          {activeChallenges.length > 0 ? (
            <FlatList
              data={activeChallenges}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.featuredChallenge}>
                  <Text style={styles.challengeTitle}>{item.title}</Text>
                  <Text style={styles.challengeDescription}>{item.description}</Text>
                  <Text style={styles.rewardText}>Reward: {item.reward} pts</Text>
                  <TouchableOpacity style={styles.joinButton} onPress={() => joinChallenge(item.id,"1")}>
                    <Text style={styles.joinButtonText}>Join Challenge</Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={40} color="#999" />
              <Text>No Active Challenges</Text>
              <Text style={styles.grayText}>You don’t have any active challenges right now.</Text>
              <TouchableOpacity style={styles.browseButton}>
                <Text style={styles.browseButtonText}>Browse Challenges</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {tab === "Completed" && (
        <>
          {completedChallenges.length > 0 ? (
            <FlatList
              data={completedChallenges}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.featuredChallenge}>
                  <Text style={styles.challengeTitle}>{item.title}</Text>
                  <Text style={styles.challengeDescription}>{item.description}</Text>
                  <Text style={styles.rewardText}>Reward: {item.reward} pts</Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={40} color="#999" />
              <Text>No Completed Challenges</Text>
              <Text style={styles.grayText}>You haven’t completed any challenges yet.</Text>
            </View>
          )}
        </>
      )}

      {/* Featured Challenges Section */}
      <Text style={styles.sectionTitle}>Featured Challenges</Text>
      <FlatList
        data={featuredChallenges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.featuredChallenge}>
            <Text style={styles.challengeTitle}>{item.title}</Text>
            <Text style={styles.challengeDescription}>{item.description}</Text>
            <Text style={styles.rewardText}>Reward: {item.reward} pts</Text>
            <TouchableOpacity style={styles.joinButton} onPress={() => joinChallenge(item.id,"1")}>
              <Text style={styles.joinButtonText}>Join Challenge</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FCFB" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: "#666", marginBottom: 15 },
  tabContainer: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E0E0E0", marginVertical: 10 },
  tab: { flex: 1, padding: 10, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#26C165" },
  tabText: { fontSize: 16, color: "#666", fontWeight: "bold" },
  emptyState: { alignItems: "center", padding: 20, marginTop: 20 },
  grayText: { color: "#999", marginVertical: 5 },
  browseButton: { backgroundColor: "#26C165", borderColor: "#ddd", borderWidth: 1, padding: 12, borderRadius: 10, marginTop: 10 },
  browseButtonText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  featuredChallenge: { backgroundColor: "#fff", borderRadius: 10, padding: 16, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  challengeTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  challengeDescription: { color: "#666", marginBottom: 10 },
  rewardText: { color: "#666", marginBottom: 5 },
  joinButton: { backgroundColor: "#fff", borderColor: "#ddd", borderWidth: 1, padding: 8, borderRadius: 10 },
  joinButtonText: { color: "#333", fontWeight: "bold" },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
});