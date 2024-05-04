import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Tablayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "black" }}>
      <Tabs.Screen
        name="Calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Diary"
        options={{
          title: "Diary",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={28} name="book" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
