import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Modal,
  ScrollView,
} from "react-native";
import {
  AlertTriangle,
  Check,
  Club,
  MapPin,
  MessageSquare,
  Share2,
} from "lucide-react-native"; // Make sure to install lucide-react-native
import { Button } from "@/components/ui/button"; // Adjust the path if necessary. If you have a custom Button, adapt it.
import { Label } from "@/components/ui/label"; // Adjust the path if necessary. If you have a custom Label, adapt it.
import { Textarea } from "@/components/ui/textarea"; // Adjust the path if necessary. If you have a custom Textarea, adapt it.
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Interface for Device (adjust this to match your actual Device interface)
interface Device {
  id: string;
  name: string;
  emoji: string;
  lastSeen: string;
  location: {
    address: string;
  };
}

// Interface for LostItemDetails
export interface LostItemDetails {
  description: string;
  contactInfo: string;
  lastSeenLocation: string;
  reward: string;
  isPublic: boolean;
}

function LostItem() {
  const { device: deviceString } = useLocalSearchParams();
  const device: Device | null = deviceString
    ? JSON.parse(String(deviceString))
    : null;
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState(
    device?.location.address || "",
  );
  const [reward, setReward] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [step, setStep] = useState<"details" | "confirmation">("details");

  const resetForm = () => {
    setDescription("");
    setContactInfo("");
    setLastSeenLocation(device?.location.address || "");
    setReward("");
    setIsPublic(true);
    setStep("details");
  };

  const handleClose = () => {
    resetForm();
  };

  const handleSubmit = () => {
    if (!device) return;
    setStep("confirmation");
  };

  const confirmMarkAsLost = () => {
    if (!device) return;
    // onMarkAsLost(device.id, {
    //   description,
    //   contactInfo,
    //   lastSeenLocation,
    //   reward,
    //   isPublic,
    // });
    handleClose();
  };

  if (!device) return null;

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }} className="p-4">
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 8,
        }}
      >
        <ScrollView>
          {step === "details" ? (
            <>
              <View className="flex flex-row items-center">
                <AlertTriangle size={20} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  Mark Item as Lost
                </Text>
              </View>
              <Text
                style={{ color: "gray", marginBottom: 10 }}
                className="font-[0.9rem]"
              >
                Provide info about your lost item to help others identify it
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  backgroundColor: "rgba(0,0,0,0.05)",
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 24 }}>{device.emoji}</Text>
                <View>
                  <Text style={{ fontWeight: "bold" }}>{device.name}</Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    Last seen: {device.lastSeen}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 8, marginBottom: 16 }}>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about your item (color, distinguishing features, etc.)"
                  value={description}
                  onChangeText={setDescription}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 4,
                    padding: 8,
                    backgroundColor: "white",
                    color: "black",
                    minHeight: 100,
                  }}
                />
              </View>

              <View style={{ gap: 8, marginBottom: 16 }}>
                <Label htmlFor="lastSeenLocation">Last Seen Location</Label>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MapPin
                    height={16}
                    width={16}
                    style={{ position: "absolute", left: 8, zIndex: 1 }}
                  />
                  <TextInput
                    id="lastSeenLocation"
                    placeholder="Where did you last see this item?"
                    value={lastSeenLocation}
                    onChangeText={setLastSeenLocation}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 4,
                      padding: 8,
                      paddingLeft: 32,
                      backgroundColor: "white",
                      color: "black",
                      flex: 1,
                    }}
                  />
                </View>
                <Text style={{ color: "gray", fontSize: 12 }}>
                  Default is the last tracked location, but you can provide more
                  specific details
                </Text>
              </View>

              <View style={{ gap: 8, marginBottom: 16 }}>
                <Label htmlFor="contactInfo">Contact Information</Label>
                <TextInput
                  id="contactInfo"
                  placeholder="Phone number or email where you can be reached"
                  value={contactInfo}
                  onChangeText={setContactInfo}
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

              <View style={{ gap: 8, marginBottom: 16 }}>
                <Label htmlFor="reward">Reward (Optional)</Label>
                <TextInput
                  id="reward"
                  placeholder="Offer a reward for finding your item"
                  value={reward}
                  onChangeText={setReward}
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

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <View>
                  <Label htmlFor="public-listing">Public Listing</Label>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    Make this visible to other users in the community
                  </Text>
                </View>
                <Switch
                  id="public-listing"
                  value={isPublic}
                  onValueChange={setIsPublic}
                  trackColor={{ false: "#767577", true: "#f0f0f0" }}
                  thumbColor={isPublic ? "#fff" : "#f4f3f4"}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 20,
                  gap: 8,
                }}
              >
                <Button variant="outline" onPress={handleClose}>
                  <Text style={{ color: "gray", fontSize: 12, flex: 1 }}>
                    Cancel
                  </Text>
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600"
                  onPress={handleSubmit}
                >
                  <Text
                    style={{ color: "black", fontSize: 14, flex: 1 }}
                    className="font-bold"
                  >
                    Mark as Lost
                  </Text>
                </Button>
              </View>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Check height={20} width={20} />
                Confirm Lost Item
              </Text>
              <Text style={{ color: "gray", marginBottom: 16 }}>
                Review the information before marking your item as lost
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  backgroundColor: "rgba(255,0,0,0.1)",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "rgba(255,0,0,0.2)",
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 24 }}>{device.emoji}</Text>
                <View>
                  <Text style={{ fontWeight: "bold" }}>{device.name}</Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    Will be marked as lost
                  </Text>
                </View>
              </View>

              <View style={{ gap: 12, marginBottom: 16 }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Description
                  </Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    {description}
                  </Text>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Last Seen Location
                  </Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    {lastSeenLocation}
                  </Text>
                </View>

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Contact Information
                  </Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    {contactInfo}
                  </Text>
                </View>

                {reward ? (
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                      Reward Offered
                    </Text>
                    <Text style={{ color: "gray", fontSize: 12 }}>
                      {reward}
                    </Text>
                  </View>
                ) : null}

                <View>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    Visibility
                  </Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>
                    {isPublic
                      ? "Public - Visible to community"
                      : "Private - Only visible to you"}
                  </Text>
                </View>
              </View>

              <View style={{ gap: 8, marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  What happens next?
                </Text>
                <View style={{ gap: 4 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <AlertTriangle
                      height={16}
                      width={16}
                      style={{ marginTop: 4 }}
                    />
                    <Text style={{ color: "gray", fontSize: 12, flex: 1 }}>
                      Your item will be marked as lost in your dashboard
                    </Text>
                  </View>
                  {isPublic ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <Share2 height={16} width={16} style={{ marginTop: 4 }} />
                      <Text style={{ color: "gray", fontSize: 12, flex: 1 }}>
                        Your item will appear in the community lost items page
                      </Text>
                    </View>
                  ) : null}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <MessageSquare
                      height={16}
                      width={16}
                      style={{ marginTop: 4 }}
                    />
                    <Text style={{ color: "gray", fontSize: 12, flex: 1 }}>
                      You'll be notified if someone finds your item
                    </Text>
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
                <Button variant="outline" onPress={() => setStep("details")}>
                  <Text style={{ color: "gray", fontSize: 12, flex: 1 }}>
                    Back
                  </Text>
                </Button>
                <Button variant="destructive" onPress={confirmMarkAsLost}>
                  <Text style={{ color: "white", fontSize: 12, flex: 1 }}>
                    Confirm
                  </Text>
                </Button>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default LostItem;
