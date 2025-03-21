import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfileScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user?.photoURL || "https://via.placeholder.com/150" }} style={styles.profileImage} />
        <Text style={styles.userName}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  profileHeader: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  userName: { fontSize: 20, fontWeight: "bold" },
  email: { color: "#666" },
  logoutButton: { backgroundColor: "red", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
});
