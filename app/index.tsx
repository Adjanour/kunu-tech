import "global.css";
import * as React from "react";
import { useState, useRef, useCallback } from "react";
import {
  View,
  useColorScheme,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import ItemDetailCard from "~/components/itemDetailCard";
import ToggleButton from "~/components/toggleButton";
import MapboxGL from "@rnmapbox/maps";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { QRScanner, BluetoothScanner } from "~/components/qrBlueetoothScanners";
import ItemCard, { Item, items } from "~/components/itemCard";
import RegisterDeviceSheet from "~/components/registerDeviceBottomSheet";
import { ConnectionMethod } from "~/components/registerDeviceBottomSheet";
import Header from "~/components/header";
import AddItemBottomSheet from "~/components/addItemBottomSheet";

MapboxGL.setAccessToken("YOUR_ACCESS_TOKEN");

interface SearchBarProps {
  isDarkMode: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isDarkMode }) => (
  <View className="flex flex-row items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 mt-4">
    <Feather name="search" size={20} color="gray" />
    <TextInput
      placeholder="Search"
      placeholderTextColor={isDarkMode ? "gray" : "black"}
      className="flex-1 px-2 py-1 text-black dark:text-white bg-transparent"
    />
  </View>
);

export default function Welcome() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [selectedItem, setSelectedItem] = useState<Item | null>(items[0]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const addItemBottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleAddItemPress = useCallback(() => {
    addItemBottomSheetRef.current?.present();
  }, []);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        className={`flex-1 p-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <Header
          onRegisterPress={handlePresentModalPress}
          onAddPress={handleAddItemPress}
        />
        <SearchBar isDarkMode={isDarkMode} />
        <View className="py-4">
          <ToggleButton
            options={["Items", "People"]}
            onToggle={(state) => console.log("Toggled to:", state)}
          />
        </View>
        {selectedItem && <ItemDetailCard item={selectedItem} />}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard item={item} onSelect={setSelectedItem} />
          )}
        />

        <RegisterDeviceSheet bottomSheetRef={bottomSheetRef} />
        <AddItemBottomSheet addItemBottomSheetRef={addItemBottomSheetRef} />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}
