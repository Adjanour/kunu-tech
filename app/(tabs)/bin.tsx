import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBinStore } from "@/store/useBinStore";
import BinComponent from "~/components/Bin";

export default function BinsScreen() {
  const { bins } = useBinStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Nearby Bins</Text>
      <Text style={styles.subtitle}>Find recycling bins around you</Text>

      {/* Search Bar & Filters */}
      <TextInput 
        style={styles.searchBar} 
        placeholder="Search by location or bin name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}><Text>Plastic</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Paper</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Organic</Text></TouchableOpacity>
      </View>

      {/* Available Bins List */}
      <FlatList
        data={searchQuery !==""? bins.filter(bin => bin.id.includes(searchQuery)): bins}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <BinComponent bin={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FCFB" },
  header: { fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "gray", marginBottom: 15 },
  mapboxContainer: { backgroundColor: "#EEF7F2", padding: 15, borderRadius: 10 },
  mapboxText: { fontSize: 16, fontWeight: "bold" },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  saveButton: { backgroundColor: "#26C165", padding: 10, borderRadius: 5, alignItems: "center" },
  saveText: { color: "white", fontWeight: "bold" },
  searchBar: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  filterContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  filterButton: { backgroundColor: "#EEF7F2", padding: 10, borderRadius: 5 },
});
