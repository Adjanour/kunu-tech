import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import {
  Briefcase,
  Car,
  Gift,
  Home,
  Key,
  Laptop,
  Smartphone,
  Wallet,
  LucideIcon,
  Plus,
} from "lucide-react-native";
import { Button } from "@/components/ui/button"; // Adjust the path if necessary.  If you have a custom Button, adapt it.

// Interface for the emoji options
interface EmojiOption {
  emoji: string;
  label: string;
  icon: LucideIcon;
}

// Array of emoji options
const emojiOptions: EmojiOption[] = [
  { emoji: "🔑", label: "Keys", icon: Key },
  { emoji: "👛", label: "Wallet", icon: Wallet },
  { emoji: "🎒", label: "Backpack", icon: Briefcase },
  { emoji: "📱", label: "Phone", icon: Smartphone },
  { emoji: "💻", label: "Laptop", icon: Laptop },
  { emoji: "🏠", label: "Home", icon: Home },
  { emoji: "🚗", label: "Car", icon: Car },
  { emoji: "🎁", label: "Gift", icon: Gift },
];

interface NewDeviceDialogProps {
  onAddDevice: (device: { name: string; emoji: string }) => void;
}

export function NewDeviceDialog({ onAddDevice }: NewDeviceDialogProps) {
  const [deviceName, setDeviceName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(emojiOptions[0].emoji);

  const handleSubmit = () => {
    if (deviceName.trim()) {
      onAddDevice({
        name: deviceName,
        emoji: selectedEmoji,
      });
      setDeviceName("");
      setSelectedEmoji(emojiOptions[0].emoji);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
          Add New Item
        </Text>
        <Text style={{ color: "gray", marginBottom: 16 }}>
          Add a new item to track with your device network.
        </Text>

        <View style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <Text>Item Name</Text>
            <TextInput
              id="name"
              placeholder="My Keys"
              value={deviceName}
              onChangeText={setDeviceName}
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
                padding: 8,
                backgroundColor: "white",
                color: "black",
              }}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Text>Choose Icon</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "space-between",
              }}
            >
              {emojiOptions.map((option) => {
                const Icon = option.icon; // Get the Icon component
                return (
                  <TouchableOpacity
                    key={option.emoji}
                    onPress={() => setSelectedEmoji(option.emoji)}
                    style={{
                      height: 80,
                      width: 80,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor:
                        selectedEmoji === option.emoji
                          ? "black"
                          : "transparent", // Use a color
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 8,
                      backgroundColor: "white",
                      marginBottom: 8,
                      flexGrow: 1,
                      flexBasis: "20%",
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{option.emoji}</Text>
                    <Text style={{ fontSize: 12, textAlign: "center" }}>
                      {option.label}
                    </Text>
                    {/* Use the Icon component */}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 20,
            gap: 8,
          }}
        >
          <Button
            className="bg-white border border-gray-200 text-black dark:text-white flex flex-row justify-center items-center flex-1 mx-1"
            onPress={handleSubmit}
            disabled={!deviceName.trim()}
          >
            <Plus size={24} color="black" />
            <Text>Add Item</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
