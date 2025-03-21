import React from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "~/store/useAuthStore";
import { Link } from "@react-navigation/native";

export default function SettingsScreen() {
  const {user} = useAuthStore()
  const { notificationsEnabled, darkMode, locationServices,toggleNotifications,toggleDarkMode,toggleLocationServices } = useSettingsStore();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Settings</Text>
      <Text style={styles.subtitle}>Customize your experience</Text>

      {/* Account Section */}
      <TouchableOpacity style={styles.accountContainer}>
        <Ionicons name="person-circle-outline" size={40} color="#26C165" />
        <View style={styles.accountText}>
          <Text style={styles.accountName}>{user? user.displayName:"Guest"}</Text>
          <Text style={styles.accountStatus}>{user? "Signed In" : "Not signed in" }</Text>
        </View>
      </TouchableOpacity>

      {/* Preferences Section */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.settingRow}>
        <Ionicons name="notifications-outline" size={24} color="#26C165" />
        <Text style={styles.settingText}>Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={() => toggleNotifications()} />
      </View>
      <View style={styles.settingRow}>
        <Ionicons name="moon-outline" size={24} color="#26C165" />
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={() => toggleDarkMode()} />
      </View>
      <View style={styles.settingRow}>
        <Ionicons name="location-outline" size={24} color="#26C165" />
        <Text style={styles.settingText}>Location Services</Text>
        <Switch value={locationServices} onValueChange={() => toggleLocationServices()} />
      </View>

      {/* More Settings */}
      <Text style={styles.sectionTitle}>More Settings</Text>
      <TouchableOpacity style={styles.settingRow}>
        <Ionicons name="globe-outline" size={24} color="#26C165" />
        <Text style={styles.settingText}>Language</Text>
        <Text style={styles.settingSubtext}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingRow}>
        <Ionicons name="shield-outline" size={24} color="#26C165" />
        <Text style={styles.settingText}>Privacy & Security</Text>
      </TouchableOpacity>
      <Link action={{type:""}} href="/login">
       <TouchableOpacity>
        Log out
       </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FCFB" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: "gray", marginBottom: 15 },
  accountContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  accountText: { marginLeft: 10 },
  accountName: { fontSize: 18, fontWeight: "bold" },
  accountStatus: { color: "gray" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  settingRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, justifyContent: "space-between" },
  settingText: { flex: 1, marginLeft: 10, fontSize: 16 },
  settingSubtext: { color: "gray", marginRight: 10 },
});
