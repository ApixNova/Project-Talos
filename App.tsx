import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import CalendarView from "./components/CalendarView";
import { useEffect, useState } from "react";
import Button from "./components/Button";

import { getCurrentDate } from "./utils/functions";
import MoodPicker from "./components/MoodPicker";
import { database } from "./utils/watermelon";
import Feeling from "./model/Feeling";

export default function App() {
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());
  const [moodPicker, setMoodPicker] = useState(false);
  const [moods, setMoods] = useState<[string, number][]>([]);

  useEffect(() => {
    //on load querry moods table
    async function getMoods() {
      const moods = (await database
        .get("feelings")
        .query()
        .fetch()) as Feeling[];
      // console.log(moods[0].day);
      // console.log(moods[0].type);
      moods.forEach((mood) => {
        setMoods((prev) => {
          let moodPrev = prev;
          moodPrev.push([mood.day, mood.type]);
          return moodPrev;
        });
      });
    }
    getMoods();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome To Project Talos</Text>
      <CalendarView props={{ selectedDay, setSelectedDay, moods }} />
      <Button props={{ moodPicker, setMoodPicker }} />
      {moodPicker && <MoodPicker props={{ selectedDay }} />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e2c3d",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
