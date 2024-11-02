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
import { useSharedValue } from "react-native-reanimated";

export default function Tab() {
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const dispatch = useAppDispatch();
  const open = useSharedValue(false);

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
      <CalendarView props={{ selectedDay, setSelectedDay, open }} />
      <SaveMood
        props={{
          setMoods,
          selectedDay,
          open,
        }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
