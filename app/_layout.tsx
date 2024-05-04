import { Stack } from "expo-router/stack";
import { Provider } from "react-redux";
import { store } from "../state/store";

export default function App() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
