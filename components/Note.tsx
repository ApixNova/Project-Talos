import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { moodColor } from "../utils/palette";

export function Note() {
  return (
    <View style={styles.container}>
      <View style={styles.newNoteTitle}>
        <TextInput
          style={styles.newNoteTitleInput}
          placeholder="Title(optional)"
        />
        <Pressable style={styles.newNoteTitleMood}></Pressable>
      </View>
      <View style={styles.newNoteMain}>
        <TextInput
          // onChange={}
          // value={}
          placeholder="take a note about your day..."
          style={styles.newNoteInput}
          multiline
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 3,
    width: "100%",
    height: "100%",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "pink",
  },
  newNoteTitle: {
    backgroundColor: "#050424",
    height: "10%",
    // borderWidth: 2,
    // borderColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  newNoteTitleInput: {
    fontSize: 20,
    width: "80%",
    color: "white",
    paddingHorizontal: 5,
  },
  newNoteTitleMood: {
    backgroundColor: moodColor.blue,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "pink",
    borderWidth: 2,
    paddingHorizontal: 5,
  },
  newNoteMain: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    height: "90%",
  },
  newNoteInput: {
    color: "white",
    height: "100%",
    fontSize: 20,
    paddingHorizontal: 5,
  },
});
