import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "~/store/useAuthStore"; // Zustand Store
import { router } from "expo-router";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"user" | "collector" | "admin">("user");

  const { register, loading } = useAuthStore();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    try {
      await register(email, password, role);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "Something went wrong.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-6">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-green-600">Create</Text>
        <Text className="text-3xl font-bold text-black">Account</Text>
      </View>

      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-md px-4 py-3 text-base"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">
          Password
        </Text>
        <TextInput
          className="border border-gray-300 rounded-md px-4 py-3 text-base"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirm Password Input */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">
          Confirm Password
        </Text>
        <TextInput
          className="border border-gray-300 rounded-md px-4 py-3 text-base"
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Role Selection */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-1">
          Select Role
        </Text>
        <View className="flex-row justify-between">
          {["user", "collector", "admin"].map((r) => (
            <TouchableOpacity
              key={r}
              className={`px-4 py-3 border rounded-md ${role === r ? "bg-green-600 text-white" : "border-gray-300"}`}
              onPress={() => setRole(r as "user" | "collector" | "admin")}
            >
              <Text className={role === r ? "text-white" : "text-gray-700"}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        className="bg-green-600 rounded-lg py-3 flex items-center"
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-semibold">Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity
        className="mt-4"
        onPress={() => router.replace("/login")}
      >
        <Text className="text-center text-gray-600 text-base">
          Already have an account?{" "}
          <Text className="text-green-600 font-semibold">Sign In</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
