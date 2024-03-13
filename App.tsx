import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import CalendarView from "./components/CalendarView";
import { useState } from "react";

export default function App() {
  const [selected, setSelected] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome To Project Talos</Text>
      <CalendarView props={{ selected, setSelected }} />
      <StatusBar style="auto" />
    </View>
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
