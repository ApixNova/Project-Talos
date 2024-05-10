import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { database } from "../utils/watermelon";
import { MoodPickerProps } from "../types";
import Feeling from "../model/Feeling";
import { Q } from "@nozbe/watermelondb";
import { moodColor } from "../utils/palette";
import { MoodOption } from "./MoodOption";
import { useAppSelector } from "../state/hooks";

export default function MoodPicker({ props }: MoodPickerProps) {
  // console.log("resetting db");
  // database.write(async () => {
  //   database.unsafeResetDatabase();
  // });

  const { selectedDay, setMoods, setMoodPicker } = props;

  const moods = useAppSelector((state) => state.moods.value);

  async function handlePress(moodType: number) {
    //compare with queried mooods
    if (moods[selectedDay]) {
      if (moods[selectedDay] != moodType) {
        //if it exists already and is different, modify element
        const existingMoodId = (
          await database
            .get("feelings")
            .query(Q.where("day", selectedDay))
            .fetchIds()
        )[0];
        await database.write(async () => {
          const existingMood = await database
            .get<Feeling>("feelings")
            .find(existingMoodId);
          await existingMood.update(() => {
            existingMood.type = moodType;
          });
          console.log("mood updated");
        });
      }
    } else {
      //otherwise create one
      //save mood for day
      await database.write(async () => {
        const newMood = await database
          .get<Feeling>("feelings")
          .create((mood) => {
            mood.type = moodType;
            mood.day = selectedDay;
          });

        let moodsList = { ...moods };
        moodsList[selectedDay] = moodType;
        setMoods(moodsList);
        console.log("mood saved");
        console.log(newMood);
      });
    }
  }
  return (
    <View style={styles.container}>
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
      <View style={styles.selection}>
        <MoodOption
          props={{
            text: "a",
            handlePress,
            type: 0,
            style: styles.black,
          }}
        />
        <MoodOption
          props={{
            text: "b",
            handlePress,
            type: 1,
            style: styles.red,
          }}
        />
        <MoodOption
          props={{
            text: "good",
            handlePress,
            type: 2,
            style: styles.blue,
          }}
        />
        <MoodOption
          props={{
            text: "great",
            handlePress,
            type: 3,
            style: styles.green,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    textAlign: "center",
    color: "white",
    padding: 5,
    fontSize: 20,
  },
  close: {
    // textAlign: "center",
  },
  selection: {
    flexDirection: "row",
  },
  black: {
    backgroundColor: moodColor.black,
  },
  red: {
    backgroundColor: moodColor.red,
  },
  blue: {
    backgroundColor: moodColor.blue,
  },
  green: {
    backgroundColor: moodColor.green,
  },
});
