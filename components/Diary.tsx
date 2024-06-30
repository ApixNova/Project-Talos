import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getCurrentDate, serializeNote } from "../utils/functions";
import { FlashList } from "@shopify/flash-list";
import { NoteComponent } from "./NoteComponent";
import { useEffect, useState } from "react";
import { NotePreview } from "./NotePreview";
import { database } from "../utils/watermelon";
import Note from "../model/Note";
import { useAppSelector } from "../state/hooks";
import { palette } from "../utils/palette";

export function Diary() {
  const notes = useAppSelector((state) => state.notes as Note[]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    console.log("(debug) Notes: ");
    console.log(notes);
    if (notes.length > 0) {
      //check if we there is a note for today
      const noteForToday = notes.find((note) => note.day == getCurrentDate());
      if (noteForToday) {
        console.log("we are editing!");
        setEditing(true);
      }
    }
  }, [notes]);
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Take a note!</Text>
      <View style={styles.noteContainer}>
        <NoteComponent
          props={{ day: getCurrentDate(), editing: editing, id: "" }}
        />
      </View>
      <View style={styles.noteList}>
        {notes.length > 0 && (
          <FlashList
            data={notes}
            renderItem={({ item }) => {
              // return <Note data={item} />;
              return <NotePreview data={item} />;
            }}
            estimatedItemSize={200}
          />
        )}
      </View>
      <Pressable style={styles.newEntry}>
        <FontAwesome style={styles.plus} name="plus" size={30} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    alignItems: "center",
    flex: 1,
  },
  mainTitle: {
    color: "white",
    fontSize: 20,
    marginVertical: 15,
  },
  noteContainer: {
    width: "98%",
    height: "50%",
  },
  noteList: {
    marginVertical: 10,
    width: "100%",
  },
  newEntry: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 30,
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 10,
    backgroundColor: palette.rose,
  },
  plus: {
    margin: "auto",
  },
});
