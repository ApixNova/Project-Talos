import { Pressable, StyleSheet, Text, View } from "react-native";
import { SaveMoodProps } from "../types";
import MoodPicker from "./MoodPicker";
export default function SaveMood({ props }: SaveMoodProps) {
  const { moodPicker, setMoodPicker, setMoods, selectedDay } = props;
  function onPress() {
    setMoodPicker((prev) => !prev);
  }
  return (
    <View style={styles.container}>
      {!moodPicker ? (
        <Pressable onPress={onPress}>
          <Text style={styles.buttonText}>Button</Text>
        </Pressable>
      ) : (
        <MoodPicker props={{ selectedDay, setMoods, setMoodPicker }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "black",
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontFamily: "Georgia",
  },
});
