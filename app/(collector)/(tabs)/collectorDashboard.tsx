// CollectorDashboard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CollectorMapScreen from "./CollectorMapScreen";
import BinMonitor from "../../binMonitor";

const CollectorDashboard = () => {
  const collectorId = "assigned_collector_id"; // Replace with dynamic logic

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Collector Dashboard</Text>
      <CollectorMapScreen collectorId={collectorId} />
      <BinMonitor />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FCFB",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default CollectorDashboard;