import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerTitleAlign: "center",
        headerBackButtonMenuEnabled: true,
      }}
    >
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="signup" options={{ title: "Signup" }} />
    </Stack>
  );
}
