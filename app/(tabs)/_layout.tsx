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
  <TouchableOpacity
    style={{
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: focused ? "#006400" : "transparent",}}
  >
    {children}
  </TouchableOpacity>
);

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#ffffff",
          width: "80%",
          bottom:40,
          borderRadius: 30,
          margin: "auto",
          alignItems: "center",
         
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#999",
        tabBarActiveTintColor: Colors.white,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
              <AntDesign
                name="home"
                size={size}
                color={focused ? "#006400" : "#999"}
                accessibilityLabel="Home tab"
              />
          ),
        }}
        
      />
      <Tabs.Screen
        name="mapScreen"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
           
              <Feather
                name="map-pin"
                size={size}
                color={focused ? "#006400" : "#999"}
                accessibilityLabel="Map tab"
              />
          ),
        }}
      />
      <Tabs.Screen
        name="bin"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            
              <AntDesign
                name="earth"
                size={size}
                color={focused ? "#006400" : "#999"}
                accessibilityLabel="Profile tab"
              />
          ),
        }}
      />
    <Tabs.Screen
        name="marketplace"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
              <AntDesign
                name="shoppingcart"
                size={size}
                color={focused ? "#006400" : "#999"}
                accessibilityLabel="Profile tab"
              />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
              <AntDesign
                name="creditcard"
                size={size}
                color={focused ? "#006400" : "#999"}
                accessibilityLabel="Profile tab"
              />
          ),
        }}
      />
            <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
              <AntDesign
                name="setting"
                size={size}
                color={focused ? "#006400" : "#999"}
                accessibilityLabel="Profile tab"
              />
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
