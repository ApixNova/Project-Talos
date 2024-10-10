import { Pressable, StyleSheet, Text, View } from "react-native";
import Setting from "../model/Setting";
import { useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";
import { router } from "expo-router";

export default function Screen() {
  const settings = useAppSelector((state) => state.settings as Setting[]);

  const params = new URLSearchParams(window.location.hash.slice());
  const error = params.get("error_code")?.startsWith("4") || false;
  return (
    <View
      style={[
        styles.background,
        { backgroundColor: dynamicTheme(settings, "background") },
      ]}
    >
      {error ? (
        <Text style={[styles.text, { color: dynamicTheme(settings, "text") }]}>
          Error, the link might be expired
        </Text>
      ) : (
        <>
          <Text
            style={[styles.text, { color: dynamicTheme(settings, "text") }]}
          >
            Your mail has been successfully confirmed!
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[styles.text, { color: dynamicTheme(settings, "text") }]}
            >
              You may
            </Text>
            <Pressable
              onPress={() => {
                router.navigate("/Sync/");
              }}
            >
              <Text
                style={[styles.text, { color: dynamicTheme(settings, "rose") }]}
              >
                {" "}
                login{" "}
              </Text>
            </Pressable>
            <Text
              style={[styles.text, { color: dynamicTheme(settings, "text") }]}
            >
              now
            </Text>
          </View>
        </>
      )}
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
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Inter_400Regular",
  },
});
