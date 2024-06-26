import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { moodColor } from "../../utils/palette";

export default function Tablayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: moodColor.black,
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: moodColor.black,
        },
        headerShadowVisible: false,
        // headerShown: false,
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="Calendar"
        options={{
          title: "Calendar",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={30} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Diary"
        options={{
          title: "Diary",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={30} name="book" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
