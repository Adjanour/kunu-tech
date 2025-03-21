// RewardsComponent.tsx
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useGamificationStore } from "@/store/useGamificationStore";

type RewardsProps = {
  userId: string;
};

const RewardsComponent: React.FC<RewardsProps> = ({ userId }) => {
  const { rewards, loading, error, fetchRewards } = useGamificationStore();

  React.useEffect(() => {
    fetchRewards(userId);
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#32CD32" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Rewards</Text>
      {rewards.length > 0 ? (
        <FlatList
          data={rewards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>{item.title}</Text>
              <Text style={styles.rewardDescription}>{item.description}</Text>
              <Text style={styles.rewardValue}>
                {item.type === "points" && `${item.value} pts`}
                {item.type === "level" && `Level ${item.value}`}
                {item.type === "badge" && `Badge: ${item.title}`}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No rewards yet. Keep recycling!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FCFB",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  rewardCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  rewardDescription: {
    color: "#666",
    marginBottom: 5,
  },
  rewardValue: {
    color: "#32CD32",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
  },
  errorText: {
    textAlign: "center",
    color: "red",
  },
});

export default RewardsComponent;