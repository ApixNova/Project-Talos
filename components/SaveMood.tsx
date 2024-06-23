import { Pressable, StyleSheet, Text, View } from "react-native";
import { SaveMoodProps } from "../types";
import { FontAwesome } from "@expo/vector-icons";
import { useAppSelector } from "../state/hooks";
import MoodPicker from "./MoodPicker";
import { updateMood } from "../utils/updateMood";

export default function SaveMood({ props }: SaveMoodProps) {
  const { moodPicker, setMoodPicker, setMoods, selectedDay } = props;
  const moods = useAppSelector((state) => state.moods.value);

  function onPress() {
    setMoodPicker((prev) => !prev);
  }
  async function handlePress(moodType: number) {
    await updateMood(moodType, selectedDay);
    //update state
    let moodsList = { ...moods };
    moodsList[selectedDay] = moodType;
    setMoods(moodsList);
  }
  return (
    <View style={styles.container}>
      {!moodPicker ? (
        <Pressable onPress={onPress}>
          <Text style={styles.buttonText}>Button</Text>
        </Pressable>
      ) : (
        <>
          <Pressable
            onPress={() => {
              setMoodPicker(false);
            }}
          >
            <FontAwesome
              style={styles.close}
              name="close"
              size={24}
              color="white"
            />
          </Pressable>
          <Text style={styles.title}>How was your day?</Text>

          <MoodPicker handlePress={handlePress} />
        </>
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
  title: {
    textAlign: "center",
    color: "white",
    padding: 5,
    fontSize: 20,
  },
  close: {
    // textAlign: "center",
  },
});
