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
import { useAuthStore } from "~/store/useAuthStore"; // Import Zustand auth store
import { router } from "expo-router";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useAuthStore(); // Zustand state and login function

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert("Success", "Logged in successfully!");
      router.replace("/(home)");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Something went wrong.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-6">
      {/* Welcome Text */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-green-600">Welcome</Text>
        <Text className="text-3xl font-bold text-black">Back</Text>
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
      <View className="mb-6">
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

      {/* Sign In Button */}
      <TouchableOpacity
        className="bg-green-600 rounded-lg py-3 flex items-center"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-semibold">Sign in</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default LoginScreen;
