import { View, Text, StyleSheet } from "react-native";
import { database } from "../utils/watermelon";
import { getCurrentDate } from "../utils/functions";
import { MoodPickerProps } from "../types";
import Feeling from "../model/Feeling";

export default function MoodPicker({ props }: MoodPickerProps) {
  //
  // console.log("resetting db");
  // database.write(async () => {
  //   database.unsafeResetDatabase();
  // });
  //
  const { selectedDay, setMoods, moods } = props;

  async function handlePress(moodType: number) {
    //save mood for day
    await database.write(async () => {
      const newMood = await database.get<Feeling>("feelings").create((mood) => {
        mood.type = moodType;
        mood.day = selectedDay;
      });
      setMoods((prev) => {
        let moodsList = prev;
        moodsList.push([selectedDay, moodType]);
        return moodsList;
      });
      console.log("I did a thing");
      console.log(newMood);
    });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Picker</Text>
      <View style={styles.selection}>
        <Text
          onPress={() => {
            handlePress(0);
          }}
          style={styles.item}
        >
          Black
        </Text>
        <Text
          onPress={() => {
            handlePress(1);
          }}
          style={styles.item}
        >
          Red
        </Text>
        <Text
          onPress={() => {
            handlePress(2);
          }}
          style={styles.item}
        >
          Blue
        </Text>
        <Text
          onPress={() => {
            handlePress(3);
          }}
          style={styles.item}
        >
          Green
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
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
