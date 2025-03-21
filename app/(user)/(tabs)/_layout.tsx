import React from "react";
import { router, Tabs } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import Colors from "@/constants/Colors";

interface IconContainerProps {
  focused: boolean;
}

const TabIconWrapper = ({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) => (
  <View
    style={{
      padding: 12,
      borderRadius: 30,
      backgroundColor: focused ? "#006400" : Colors.grey,
      width: 50,
      height: 50,
      justifyContent: "center",
    }}
  >
    {children}
  </View>
);

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#ffffff",
          bottom: 40,
          width: "40%",
          height: 60,
          margin: "auto",
          display: "flex",
          borderRadius: 40,
          borderWidth: 1,
          borderTopWidth: 1,
          padding: 10,
          borderColor: "#333",
          borderTopColor: "#333",
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#999",
        tabBarActiveTintColor: Colors.white,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconWrapper focused={focused}>
              <AntDesign
                name="home"
                size={size}
                color={color}
                accessibilityLabel="Home tab"
              />
            </TabIconWrapper>
          ),
        }}
        
      />
      <Tabs.Screen
        name="mapScreen"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconWrapper focused={focused}>
              <Feather
                name="map-pin"
                size={size}
                color={color}
                accessibilityLabel="Map tab"
              />
            </TabIconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIconWrapper focused={focused}>
              <AntDesign
                name="user"
                size={size}
                color={color}
                accessibilityLabel="Profile tab"
              />
            </TabIconWrapper>
          ),
        }}
      />
    </Tabs>
  );
};

const styles = {
  fabButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: Colors.tintColor,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
};

export default Layout;
