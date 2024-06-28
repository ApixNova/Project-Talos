import { Stack } from "expo-router/stack";
import { Provider } from "react-redux";
import { store } from "../state/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import MyDrawer from "../components/MyDrawer";
import { Text } from "react-native";

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer drawerContent={MyDrawer}>
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerLabel: "Calendar/Diary",
              title: "Drawer",
            }}
          />
          <Drawer.Screen
            name="Settings"
            options={{
              drawerLabel: ({ color, focused }) => (
                <Text style={{ color: focused ? "red" : "black" }}>
                  Settingsu
                </Text>
              ),
            }}
          />
          <Drawer.Screen name="Sync" />
        </Drawer>
      </GestureHandlerRootView>
      {/* <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack> */}
    </Provider>
  );
}
