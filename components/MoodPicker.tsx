import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { database } from "../utils/watermelon";
import { getCurrentDate } from "../utils/functions";
import { MoodOptionProps, MoodPickerProps } from "../types";
import Feeling from "../model/Feeling";
import { Q } from "@nozbe/watermelondb";
import { moodColor } from "../utils/palette";
import { MoodOption } from "./MoodOption";

export default function MoodPicker({ props }: MoodPickerProps) {
  // console.log("resetting db");
  // database.write(async () => {
  //   database.unsafeResetDatabase();
  // });

  const { selectedDay, setMoods, moods, setMoodPicker } = props;

  const { width } = useWindowDimensions();

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
        setMoods((prev) => {
          let moodsList = prev;
          // moodsList.push([selectedDay, moodType]);
          moodsList[selectedDay] = moodType;
          return moodsList;
        });
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
        <Text style={styles.title}>x</Text>
      </Pressable>
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
            text: "c",
            handlePress,
            type: 2,
            style: styles.blue,
          }}
        />
        <MoodOption
          props={{
            text: "d",
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
