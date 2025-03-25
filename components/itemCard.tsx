import { Card } from "~/components/ui/card";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface Device {
  id: string;
  code?: string;
  batteryLevel?: number;
  batteryStatus?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  lastUpdated?: Date;
}

export interface Item {
  id: string;
  name: string;
  device: Device;
}

export const items: Item[] = [
  {
    id: "1",
    name: "Item 1",
    device: {
      id: "1",
      code: "ABC123",
      batteryLevel: 80,
      batteryStatus: "Good",
      location: "Accra",
      latitude: 5.555555,
      longitude: -0.123456,
      lastUpdated: new Date(),
    },
  },
  {
    id: "2",
    name: "Item 2",
    device: {
      id: "2",
      code: "XYZ789",
      batteryLevel: 60,
      batteryStatus: "Low",
      location: "Kumasi",
      latitude: 6.555555,
      longitude: -1.123456,
      lastUpdated: new Date(),
    },
  },
];

export interface ItemCardProps {
  item: Item;
  onSelect: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => (
  <Pressable onPress={() => onSelect(item)}>
    <Card className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 my-2">
      <View className="flex flex-row items-center px-4 py-3 gap-3">
        <Feather name="shopping-bag" size={20} className="" />
        <View className="flex-1 flex flex-col">
          <Text className="text-black text-lg font-bold dark:text-white">
            {item.name}
          </Text>
          <View className="text-gray-500 flex flex-row items-center gap-2">
            <Feather name="battery" size={16} className="mr-1" />
            <Text className="text-gray-500">{item.device.batteryLevel}% •</Text>
            <Text className="text-gray-500">
              {item.device.lastUpdated?.toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  </Pressable>
);

export default ItemCard;
