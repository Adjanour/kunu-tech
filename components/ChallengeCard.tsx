import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ChallengeCard({ challenge, onJoin }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{challenge.name}</Text>
      <Text style={styles.description}>{challenge.description}</Text>
      <Text style={styles.reward}>Reward: {challenge.reward} pts</Text>
      <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
        <Text style={styles.joinButtonText}>Join Challenge</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "white", padding: 15, borderRadius: 10, marginVertical: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5 },
  name: { fontSize: 16, fontWeight: "bold" },
  description: { color: "gray", marginVertical: 5 },
  reward: { fontWeight: "bold", color: "#26C165" },
  joinButton: { backgroundColor: "#26C165", padding: 10, borderRadius: 8, marginTop: 10, alignItems: "center" },
  joinButtonText: { color: "white", fontWeight: "bold" },
});
