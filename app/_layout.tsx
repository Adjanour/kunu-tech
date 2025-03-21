import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "~/lib/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useAuthStore } from "@/store/useAuthStore";
import { registerDeviceToken } from "@/services/api";
import { NAV_THEME } from "~/lib/constants";

// Light & Dark Theme Setup
const LIGHT_THEME: Theme = { ...DefaultTheme, colors: NAV_THEME.light };
const DARK_THEME: Theme = { ...DarkTheme, colors: NAV_THEME.dark };

// ✅ Prevent `NativeEventEmitter` warning
import { NativeEventEmitter, NativeModules } from "react-native";
const { ExpoNotifications } = NativeModules;
let notificationsEmitter;
try {
  notificationsEmitter = new NativeEventEmitter(ExpoNotifications);
} catch (error) {
  console.warn("NativeEventEmitter setup failed:", error);
}

// Configure how notifications are handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { user } = useAuthStore();
  const router = useRouter();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  // ✅ Request Push Notification Permissions
  async function requestNotificationPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Notification Permission",
        "Please enable notifications to receive alerts."
      );
      return false;
    }
    return true;
  }

  // ✅ Register Device for Push Notifications (with EAS support)
  async function getDeviceToken() {
    if (!user) return;
    
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    try {
      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: "58e5fec9-2425-4618-9750-b0a1f3007250", // ⚠️ Required for EAS
      });

      console.log("Push token:", token);
      await registerDeviceToken(user.uid, token);
    } catch (error) {
      console.error("Error getting push token:", error);
    }
  }

  // ✅ Handle Foreground Notifications
  React.useEffect(() => {
    getDeviceToken();

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        Alert.alert(
          notification.request.content.title ?? "",
          notification.request.content.body ?? ""
        );
      });

    return () => foregroundSubscription.remove(); // Cleanup listener
  }, [user]);

  // ✅ Handle Background Notifications (Deep Linking)
  React.useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.screen) {
          router.push(data.screen); // Navigate to the specified screen
        }
      });

    return () => backgroundSubscription.remove(); // Cleanup listener
  }, []);

  // ✅ Setup Navigation Bar & Theme
  React.useEffect(() => {
    if (hasMounted.current) return;
    if (Platform.OS === "web")
      document.documentElement.classList.add("bg-background");
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) return null;

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: isDarkColorScheme ? "gray" : "lightgray",
            flex: 1,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Welcome" }} />
        <Stack.Screen name="(auth)" options={{ title: "Auth" }} />
        <Stack.Screen name="(tabs)" options={{ title: "Tabs" }} />
      </Stack>
    </ThemeProvider>
  );
}
