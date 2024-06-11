import { Pressable, StyleSheet, Text, View } from "react-native";
import { SaveMoodProps } from "../types";
import { database } from "../utils/watermelon";
import { FontAwesome } from "@expo/vector-icons";
import Feeling from "../model/Feeling";
import { useAppSelector } from "../state/hooks";
import { Q } from "@nozbe/watermelondb";
import MoodPicker from "./MoodPicker";
export default function SaveMood({ props }: SaveMoodProps) {
  const { moodPicker, setMoodPicker, setMoods, selectedDay } = props;
  const moods = useAppSelector((state) => state.moods.value);

  function onPress() {
    setMoodPicker((prev) => !prev);
  }
  async function handlePress(moodType: number) {
    //compare with queried moods
    const existsInDatabase = await database
      .get<Feeling>("feelings")
      .query(Q.where("day", selectedDay));
    if (existsInDatabase.length > 0) {
      if (existsInDatabase[0].type != moodType) {
        //if it exists already and is different, modify element
        await database.write(async () => {
          await existsInDatabase[0].update(() => {
            existsInDatabase[0].type = moodType;
          });
        });
      }
    } else {
      //otherwise create one
      await database.write(async () => {
        await database.get<Feeling>("feelings").create((mood) => {
          mood.type = moodType;
          mood.day = selectedDay;
        });
      });
    }
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
