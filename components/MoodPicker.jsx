import { View, Text, StyleSheet } from "react-native";
import { database } from "../utils/watermelon";
import { getCurrentDate } from "./utils";

export default function MoodPicker() {
  async function handlePress(mood) {
    //save mood for day
    const newMood = await database.get("feelings").create((mood) => {
      mood.type = mood;
      mood.day = getCurrentDate();
    });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Picker</Text>
      <View style={styles.selection}>
        <Text onPress={handlePress(0)} style={styles.item}>
          Black
        </Text>
        <Text onPress={handlePress(1)} style={styles.item}>
          Red
        </Text>
        <Text onPress={handlePress(2)} style={styles.item}>
          Blue
        </Text>
        <Text onPress={handlePress(3)} style={styles.item}>
          Green
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
  },
  title: {
    textAlign: "center",
  },
  selection: {
    flexDirection: "row",
  },
  item: {
    margin: 10,
  },
});
