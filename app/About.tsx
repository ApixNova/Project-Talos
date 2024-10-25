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
      <View
        style={[
          styles.textContainer,
          {
            borderColor: dynamicTheme(settings, "text"),
          },
        ]}
      >
        <Text style={[styles.text, { color: dynamicTheme(settings, "text") }]}>
          Talos is a mood tracker and a journaling app.{"\n\n"}
        </Text>
        <Text style={[styles.text, { color: dynamicTheme(settings, "text") }]}>
          The project is still in beta, so unexpected issues are expected :]
          {"\n\n"}
        </Text>
        <Text style={[styles.text, { color: dynamicTheme(settings, "text") }]}>
          If you have any bug to report or a suggestion, you can contact me at
        </Text>
        <Text style={[styles.text, { color: dynamicTheme(settings, "text") }]}>
          lastsupernovae@gmail.com
        </Text>
        <Text
          style={[
            styles.text,
            styles.last,
            { color: dynamicTheme(settings, "text") },
          ]}
        >
          Made by ApixNova
        </Text>
      </View>
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
  textContainer: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 770,
  },
  text: {
    fontSize: 20,
    fontFamily: "Inter-Light",
    // textAlign: "justify",
    textAlign: "center",
  },
  last: {
    marginTop: 20,
    fontSize: 18,
  },
});
