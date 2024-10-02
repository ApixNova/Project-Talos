import { Provider } from "react-redux";
import { store } from "../state/store";
import { StyleSheet } from "react-native";
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import MainLayout from "../components/MainLayout";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_900Black,
  });
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}

const styles = StyleSheet.create({
  drawerText: {
    fontFamily: "Inter_300Light",
    fontSize: 16,
  },
});
