import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MyDrawer from "../components/MyDrawer";
import Setting from "../model/Setting";
import { useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";

export default function MainLayout() {
  const settings = useAppSelector((state) => state.settings as Setting[]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={MyDrawer}
        screenOptions={{
          drawerActiveBackgroundColor: dynamicTheme(settings, "rose"),
          headerStyle: {
            backgroundColor: dynamicTheme(settings, "rose"),
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "Inter-Regular",
          },
          headerTitleAlign: "center",
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerIcon: (color) => (
              <FontAwesome5
                size={30}
                name="book"
                color={color.focused ? "white" : dynamicTheme(settings, "text")}
              />
            ),
            drawerLabel: ({ color, focused }) => (
              <Text
                style={[
                  styles.drawerText,
                  {
                    color: focused ? "white" : dynamicTheme(settings, "text"),
                  },
                ]}
              >
                Calendar & Diary
              </Text>
            ),
            title: "Talos",
            headerTitleStyle: {
              fontFamily: "Inter-Black",
              fontSize: 30,
              color: dynamicTheme(settings, "background"),
            },
            // headerTitle: (props) => (
            //   <FontAwesome5 size={30} name="book" color={"white"} />
            // ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          options={{
            headerTitleStyle: {
              fontFamily: "Inter-Black",
              fontSize: 30,
              color: dynamicTheme(settings, "background"),
            },
            drawerIcon: (color) => (
              <Ionicons
                name="settings-sharp"
                size={30}
                color={color.focused ? "white" : dynamicTheme(settings, "text")}
              />
            ),
            drawerLabel: ({ color, focused }) => (
              <Text
                style={[
                  styles.drawerText,
                  { color: focused ? "white" : dynamicTheme(settings, "text") },
                ]}
              >
                Settings
              </Text>
            ),
          }}
        />
        <Drawer.Screen
          name="Sync"
          options={{
            headerTitleStyle: {
              fontFamily: "Inter-Black",
              fontSize: 30,
              color: dynamicTheme(settings, "background"),
            },
            drawerIcon: (color) => (
              <FontAwesome5
                name="sync-alt"
                size={24}
                color={color.focused ? "white" : dynamicTheme(settings, "text")}
              />
            ),
            drawerLabel: ({ color, focused }) => (
              <Text
                style={[
                  styles.drawerText,
                  { color: focused ? "white" : dynamicTheme(settings, "text") },
                ]}
              >
                Sync
              </Text>
            ),
          }}
        />
        <Drawer.Screen
          name="About"
          options={{
            headerTitleStyle: {
              fontFamily: "Inter-Black",
              fontSize: 30,
              color: dynamicTheme(settings, "background"),
            },
            drawerIcon: (color) => (
              <FontAwesome5
                name="info-circle"
                size={24}
                color={color.focused ? "white" : dynamicTheme(settings, "text")}
              />
            ),
            drawerLabel: ({ color, focused }) => (
              <Text
                style={[
                  styles.drawerText,
                  { color: focused ? "white" : dynamicTheme(settings, "text") },
                ]}
              >
                About
              </Text>
            ),
          }}
        />
        <Drawer.Screen
          name="MailConfirmation"
          options={{
            headerTitleStyle: {
              fontFamily: "Inter-Black",
              fontSize: 26,
              color: dynamicTheme(settings, "background"),
            },
            headerTitle: "Mail Confirmation",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          options={{
            headerTitleStyle: {
              fontFamily: "Inter-Black",
              fontSize: 26,
              color: dynamicTheme(settings, "background"),
            },
            headerTitle: "Welcome",
            drawerItemStyle: { display: "none" },
          }}
          name="index"
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  drawerText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
  },
});
