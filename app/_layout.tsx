import { Provider } from "react-redux";
import { store } from "../state/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import MyDrawer from "../components/MyDrawer";
import { StyleSheet, Text } from "react-native";
import { palette } from "../utils/palette";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Inter_300Light,
  Inter_500Medium,
  Inter_400Regular,
  Inter_900Black,
} from "@expo-google-fonts/inter";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_900Black,
  });
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={MyDrawer}
          screenOptions={{
            drawerActiveBackgroundColor: palette.rose,
            headerStyle: {
              backgroundColor: palette.rose,
            },
            headerShadowVisible: false,
            headerTitleStyle: {
              fontFamily: "Inter_400regular",
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
                  color={color.focused ? "white" : "pink"}
                />
              ),
              drawerLabel: ({ color, focused }) => (
                <Text
                  style={[
                    styles.drawerText,
                    { color: focused ? "white" : "pink" },
                  ]}
                >
                  Calendar & Diary
                </Text>
              ),
              title: "Talos",
              headerTitleStyle: {
                fontFamily: "Inter_900Black",
                fontSize: 30,
                color: palette.background,
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
                fontFamily: "Inter_900Black",
                fontSize: 30,
                color: palette.background,
              },
              drawerIcon: (color) => (
                <Ionicons
                  name="settings-sharp"
                  size={30}
                  color={color.focused ? "white" : "pink"}
                />
              ),
              drawerLabel: ({ color, focused }) => (
                <Text
                  style={[
                    styles.drawerText,
                    { color: focused ? "white" : "pink" },
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
                fontFamily: "Inter_900Black",
                fontSize: 30,
                color: palette.background,
              },
              drawerIcon: (color) => (
                <FontAwesome5
                  name="sync-alt"
                  size={24}
                  color={color.focused ? "white" : "pink"}
                />
              ),
              drawerLabel: ({ color, focused }) => (
                <Text
                  style={[
                    styles.drawerText,
                    { color: focused ? "white" : "pink" },
                  ]}
                >
                  Sync
                </Text>
              ),
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  drawerText: {
    fontFamily: "Inter_300Light",
    fontSize: 16,
  },
});
