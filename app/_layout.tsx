import { Provider } from "react-redux";
import { store } from "../state/store";
import MainLayout from "../components/MainLayout";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.otf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.otf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.otf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.otf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.otf"),
  });
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}
