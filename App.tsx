import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import CalendarView from "./components/CalendarView";
import { useState } from "react";
import Button from "./components/Button";

import { getCurrentDate } from "./components/utils";
import MoodPicker from "./components/MoodPicker";

export default function App() {
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());
  const [moodPicker, setMoodPicker] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome To Project Talos</Text>
      <CalendarView props={{ selectedDay, setSelectedDay }} />
      <Button props={{ moodPicker, setMoodPicker }} />
      {moodPicker && <MoodPicker />}
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
