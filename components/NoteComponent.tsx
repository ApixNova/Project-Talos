import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { moodColor } from "../utils/palette";
import { getCurrentDate } from "../utils/functions";
import { Moods, NoteProps } from "../types";
import { database } from "../utils/watermelon";
import { Q } from "@nozbe/watermelondb";
import MoodPicker from "./MoodPicker";
import { useState } from "react";

export function NoteComponent({ props }: NoteProps) {
  const { day, editing, id } = props;
  const [moodPicker, setMoodPicker] = useState(true);
  const [moodType, setMoodType] = useState("");
  function handleMoodPress(moodType: number) {
    setMoodType(JSON.stringify(moodType));
  }
  async function saveNote() {
    //Save note to DB
    //if editing then edit db
    if (editing) {
      const existingNoteId = (
        await database.get("notes").query(Q.where("day", day)).fetchIds()
      )[0];
      await database.write(async () => {
        const existingNote = await database.get("notes").find(existingNoteId);
        await existingNote.update(() => {});
      });
    } else {
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.newNoteTitle}>
        <TextInput
          style={styles.newNoteTitleInput}
          placeholder="Title(optional)"
        />
        <Pressable style={styles.newNoteTitleMood}></Pressable>
        <Pressable onPress={saveNote}>
          <Text style={{ color: "white" }}>[Save]</Text>
        </Pressable>
      </View>
      <View style={styles.newNoteMain}>
        <TextInput
          // onChange={}
          // value={}
          placeholder="take a note about your day..."
          style={styles.newNoteInput}
          multiline
        />
        <MoodPicker handlePress={handleMoodPress} />
        <Text style={{ color: "white" }}>Mood: {moodType}</Text>
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
