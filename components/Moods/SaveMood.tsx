import { Pressable, StyleSheet, Text, View } from "react-native";
import { SaveMoodProps } from "../../types";
import { FontAwesome } from "@expo/vector-icons";
import { useAppSelector } from "../../state/hooks";
import MoodPicker from "./MoodPicker";
import { updateMood } from "../../utils/updateMood";
import { palette } from "../../utils/palette";

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
          <Text style={styles.buttonText}>Save Mood</Text>
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
          <Text style={styles.title}>How was your day ?</Text>

          <MoodPicker handlePress={handlePress} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: palette.text,
    borderWidth: 2,
    backgroundColor: palette.accent,
    padding: 15,
  },
  buttonText: {
    color: palette.background,
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
  title: {
    textAlign: "center",
    color: palette.background,

    fontFamily: "Inter_500Medium",
    padding: 5,
    fontSize: 20,
  },
  close: {
    // textAlign: "center",
    color: palette.background,
  },
});
