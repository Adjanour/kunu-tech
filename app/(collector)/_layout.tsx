import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Tabs" }} />
      <Stack.Screen name="(tabs)" options={{title: "Tab"}} />
    </Stack>
  );
}
