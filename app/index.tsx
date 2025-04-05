import { Text, View, StyleSheet, Image } from "react-native";
import Button from "../components/Button";
import { useAppSelector } from "../state/hooks";
import Setting from "../model/Setting";
import { dynamicTheme } from "../utils/palette";
import { router } from "expo-router";

export default function Page() {
  const settings = useAppSelector((state) => state.settings as Setting[]);
  return (
    <View
      style={[
        styles.background,
        { backgroundColor: dynamicTheme(settings, "background") },
      ]}
    >
      <Image style={styles.image} source={require("../assets/icon.png")} />
      <Text style={[styles.text, { color: dynamicTheme(settings, "text") }]}>
        Welcome to Talos, the mood tracker!
      </Text>
      <Button
        text="Get Started"
        onPress={() => {
          router.navigate("./Calendar");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    gap: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
  },
  text: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});
