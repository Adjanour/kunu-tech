import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import MapboxGL from "@rnmapbox/maps";
import { Card } from "./ui/card";
import { Item } from "./itemCard";
import { Button } from "./ui/button";
import { useRouter } from "expo-router";
import { AlertOctagon, AlertTriangle } from "lucide-react-native";

export interface ItemDetailCardProps {
  item: Item;
}

const ItemDetailCard: React.FC<ItemDetailCardProps> = ({ item }) => {
  if (!item) return null;
  const router = useRouter();
  const device = {
    id: "device123",
    name: "Smartphone",
    emoji: "📱",
    lastSeen: "2025-03-24T14:00:00Z",
    location: {
      address: "123 Main St, Accra, Ghana",
    },
  };

  const openLostItemScreen = () => {
    router.push({
      pathname: "/lost-item",
      params: { device: JSON.stringify(device) },
    });
  };
  return (
    <Card className="bg-white dark:bg-gray-800 p-4 gap-y-4 rounded-lg border border-gray-300 dark:border-gray-600">
      <View className="flex flex-row items-center justify-between gap-2">
        <View className="flex flex-row items-center gap-2">
          <Feather name="key" size={18} color="black" />
          <Text className="text-black font-bold">{item.name}</Text>
        </View>
        <Pressable>
          <Feather name="arrow-right" size={20} color="black" />
        </Pressable>
      </View>
      <View className="flex flex-row gap-x-1.5 text-gray-300 ">
        <Feather name="map-pin" size={15} color="gray" />
        <Text className="text-gray-500">{item.device.location}</Text>
      </View>
      <MapboxGL.MapView style={{ width: "100%", height: 165 }} />
      <View className="mt-4 border-b-1 border-gray-300 mb-2 flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          <Feather name="navigation" size={20} color="black" />
          <Text className="text-black dark:text-white">Navigation</Text>
        </View>
        <Text className="text-gray-500">Updated 2 mins ago</Text>
      </View>
      <View className="flex flex-row w-full items-center justify-evenly">
        <Button className="bg-white border-gray-200 border flex flex-row justify-center items-center flex-1 mx-1">
          <Feather name="play" size={20} color="black" />
          <Text className="text-black dark:text-white ml-1">Play Sound</Text>
        </Button>
        <Button className="bg-white border border-gray-200 flex flex-row justify-center items-center flex-1 mx-1">
          <Feather name="navigation" size={20} color="black" />
          <Text className="text-black dark:text-white ml-1">Direction</Text>
        </Button>
        <Button
          className="bg-white border border-red-500 flex flex-row justify-center items-center flex-1 mx-1"
          onPress={openLostItemScreen}
        >
          <AlertOctagon />
          <Text className="text-black dark:text-white"> Lost</Text>
        </Button>
      </View>
    </Card>
  );
};

export default ItemDetailCard;
