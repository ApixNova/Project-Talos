import { Text, View, StyleSheet } from "react-native";
import Setting from "../model/Setting";
import { useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";
export default function Screen() {
  const settings = useAppSelector((state) => state.settings as Setting[]);
  return (
    <View
      style={[
        styles.background,
        { backgroundColor: dynamicTheme(settings, "background") },
      ]}
    >
      <Text style={[styles.text, { color: dynamicTheme(settings, "text") }]}>
        Made By ApixNova
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontFamily: "Inter_400Regular",
  },
});
