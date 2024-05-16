import { View, Text, StyleSheet, Pressable } from "react-native";
import { Note } from "../types";
import { Link, router } from "expo-router";

export function NotePreview({ data }: { data: Note }) {
  function handlePress() {
    router.navigate("/Diary/" + data.id);
  }
  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text
        style={{
          color: "white",
          fontSize: 17,
        }}
      >
        {data.date + " | " + data.title + " | " + data.mood}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    borderRadius: 10,
    padding: 3,
    borderColor: "pink",
    marginVertical: 1,
    width: "98%",
    margin: "auto",
  },
});
