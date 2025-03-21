// MarketplaceScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";
import ItemCard from "~/components/ItemCard";

export default function MarketplaceScreen() {
  const { items, fetchItems, createItem, updateItem } = useMarketplaceStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    category: "",
    description: "",
    condition: "",
    location: "",
    image_url: "",
    available: true,
    points: 0,
    seller: "KunuTech",
    isNew: true,
    imageUrl: "https://via.placeholder.com/150",
    postedAgo: "Just now",
  });

  useEffect(() => {
    fetchItems(); // Load marketplace items
  }, []);

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new item
  const handleAddItem = async () => {
    if (!newItem.title || !newItem.category || !newItem.description) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      await createItem(newItem);
      setIsAddingItem(false);
      setNewItem({
        title: "",
        category: "",
        description: "",
        condition: "",
        location: "",
        image_url: "",
        available: true,
        points: 0,
        seller: "KunuTech",
        isNew: true,
        imageUrl: "https://via.placeholder.com/150",
        postedAgo: "Just now",
      });
      Alert.alert("Success", "Item added successfully!");
    } catch (error) {
      console.error("Failed to add item:", error);
      Alert.alert("Error", "Failed to add the item. Please try again.");
    }
  };

  // Handle making a purchase
  const handlePurchase = async (itemId: string) => {
    try {
      await updateItem(itemId, false); // Mark item as unavailable
      Alert.alert("Success", "Purchase completed successfully!");
    } catch (error) {
      console.error("Failed to complete purchase:", error);
      Alert.alert("Error", "Failed to complete the purchase. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Marketplace</Text>
      <Text style={styles.subtitle}>Buy, sell, or trade recycled items</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search marketplace items"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Add Item Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddingItem(true)}
      >
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>

      {/* Add Item Form */}
      {isAddingItem && (
        <View style={styles.addItemForm}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newItem.title}
            onChangeText={(text) => setNewItem({ ...newItem, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={newItem.category}
            onChangeText={(text) => setNewItem({ ...newItem, category: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newItem.description}
            onChangeText={(text) => setNewItem({ ...newItem, description: text })}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddItem}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Item List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
                      />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FCFB" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: "gray", marginBottom: 15 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 10,
  },
  searchInput: { marginLeft: 10, flex: 1 },
  addButton: {
    backgroundColor: "#26C165",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  addItemForm: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#32CD32",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: { color: "white", fontWeight: "bold" },
});