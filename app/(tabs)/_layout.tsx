import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { dynamicTheme, moodColor } from "../../utils/palette";
import { useAppSelector } from "../../state/hooks";
import Setting from "../../model/Setting";
import { Platform, useWindowDimensions } from "react-native";

export default function Tablayout() {
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const { width } = useWindowDimensions();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarShowLabel: Platform.OS == "web" && width >= 500,
        tabBarStyle: {
          backgroundColor: dynamicTheme(settings, "background"),
          borderTopWidth: 2,
          borderTopColor: dynamicTheme(settings, "secondary", 20),
          height: 50,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter-Regular",
        },
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
