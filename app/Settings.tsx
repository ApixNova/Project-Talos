import { View, Text, StyleSheet, Pressable } from "react-native";
import { palette } from "../utils/palette";
import { database } from "../utils/watermelon";

export default function Screen() {
  function resetDatabase() {
    console.log("resetting db");
    database.write(async () => {
      database.unsafeResetDatabase();
    });
  }
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={resetDatabase}>
        <Text style={styles.text}>Reset DB</Text>
      </Pressable>
      <Text style={styles.text}>Change Theme</Text>
      <Text style={styles.text}>First Day Of The Week</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    height: "100%",
    alignItems: "center",
    gap: 50,
    paddingTop: 20,
    borderWidth: 2,
    borderColor: palette.text,
  },
  title: {
    color: "white",
    fontFamily: "Inter_900Black",
    fontSize: 30,
    marginHorizontal: "auto",
  },
  button: {
    backgroundColor: "white",
  },
  text: {
    color: palette.secondary,
    fontSize: 20,
    fontFamily: "Inter_400Regular",
  },
});
