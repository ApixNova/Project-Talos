import { Text, SafeAreaView, StyleSheet, Pressable } from "react-native";
import { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { database } from "../../utils/watermelon";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { editMood } from "../../state/moodSlice";
import { getCurrentDate } from "../../utils/functions";
import { Moods } from "../../types";
import Feeling from "../../model/Feeling";
import CalendarView from "../../components/CalendarView";
import SaveMood from "../../components/Moods/SaveMood";
import { mySync } from "../../utils/sync";

export default function Tab() {
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());
  const [moodPicker, setMoodPicker] = useState(false);
  const moods = useAppSelector((state) => state.moods.value);
  const dispatch = useAppDispatch();

  function setMoods(list: Moods) {
    dispatch(editMood(list));
  }

  useEffect(() => {
    console.log("calendar loaded");
    //on load querry moods table
    async function getMoods() {
      const moodsQuery = (await database
        .get("feelings")
        .query()
        .fetch()) as Feeling[];
      let moodsList: Moods = {};
      moodsQuery.forEach((mood) => {
        moodsList[mood.day] = mood.type;
      });
      setMoods(moodsList);
    }
    getMoods().then(() => {
      console.log("moods queried");
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome To Project Talos</Text>
      <Pressable
        onPress={() => {
          mySync();
        }}
        style={{
          backgroundColor: "pink",
          padding: 5,
          borderRadius: 10,
        }}
      >
        <Text>Don't press me</Text>
      </Pressable>
      <CalendarView props={{ selectedDay, setSelectedDay }} />
      <SaveMood
        props={{
          moodPicker,
          setMoodPicker,
          setMoods,
          selectedDay,
        }}
      />
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
