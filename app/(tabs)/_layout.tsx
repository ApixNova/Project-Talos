import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { moodColor, palette } from "../../utils/palette";

export default function Tablayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: moodColor.black,
          borderTopWidth: 2,
          borderTopColor: palette.rose,
          height: 50,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_400regular",
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
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <FontAwesome6 name="book-open" size={30} color={color} />
            ) : (
              <FontAwesome5 name={"book"} size={30} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
