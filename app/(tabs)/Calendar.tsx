import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import CalendarView from "../../components/CalendarView";
import SaveMood from "../../components/Moods/SaveMood";
import Setting from "../../model/Setting";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { editMood } from "../../state/moodSlice";
import { Moods } from "../../types";
import { getCurrentDate } from "../../utils/functions";
import { dynamicTheme } from "../../utils/palette";

export default function Tab() {
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());
  const [moodPicker, setMoodPicker] = useState(false);
  const moods = useAppSelector((state) => state.moods.value);
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const dispatch = useAppDispatch();

  function setMoods(list: Moods) {
    dispatch(editMood(list));
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dynamicTheme(settings, "background") },
      ]}
    >
      <CalendarView props={{ selectedDay, setSelectedDay }} />
      <SaveMood
        props={{
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
    // backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
