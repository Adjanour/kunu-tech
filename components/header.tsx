import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "./ui/button";
import { Plus } from "lucide-react-native";

export interface HeaderProps {
  onRegisterPress: () => void;
  onAddPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRegisterPress, onAddPress }) => (
  <View className="w-full h-18 flex flex-row justify-between items-center">
    <Text className="text-lg font-bold text-black dark:text-white">
      HweHwe Me
    </Text>
    <View className="flex flex-row gap-2">
      <Button
        onPress={onRegisterPress}
        className="p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 flex-row items-center"
      >
        <Feather name="bluetooth" size={20} color="black" />
        <Text className="ml-2 text-black dark:text-white">Register</Text>
      </Button>
      <Button
        onPress={onAddPress}
        className="bg-white dark:bg-black border border-gray-300 rounded-full flex items-center justify-center"
      >
        <Plus size={20} color="black" />
      </Button>
    </View>
  </View>
);

export default Header;
