import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, Alert } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NAV_THEME } from "~/lib/constants";

// Light & Dark Theme Setup
const LIGHT_THEME: Theme = { ...DefaultTheme, colors: NAV_THEME.light };
const DARK_THEME: Theme = { ...DarkTheme, colors: NAV_THEME.dark };

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

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
    <GestureHandlerRootView>
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
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
