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
import { palette } from "../../utils/palette";

export default function Tab() {
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());
  const [moodPicker, setMoodPicker] = useState(false);
  const moods = useAppSelector((state) => state.moods.value);
  const dispatch = useAppDispatch();

  function setMoods(list: Moods) {
    dispatch(editMood(list));
  }

  return (
    <SafeAreaView style={styles.container}>
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
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
