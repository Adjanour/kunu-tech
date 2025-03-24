import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

type ToggleButtonProps = {
  onToggle: (state: number) => void;
  options?: [string, string];
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  onToggle,
  options = ["Option 1", "Option 2"],
}) => {
  const [active, setActive] = useState(0);

  const handleToggle = (option: number) => {
    setActive(option);
    onToggle(option);
  };

  return (
    <View className="flex flex-row items-center p-2 bg-gray-100 rounded-md">
      {options.map((option, index) => (
        <Pressable
          key={index}
          onPress={() => handleToggle(index)}
          aria-pressed={active === index}
          className={`px-4 py-2 w-1/2 text-sm rounded-md transition-all duration-300 ${
            active === index ? "bg-white text-black" : "text-[#8A8A8A]"
          }`}
        >
          <Text className="text-center">{option}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default ToggleButton;
