import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { returnColor } from "../utils/functions";
import { Moods, NoteProps } from "../types";
import { database } from "../utils/watermelon";
import { Q } from "@nozbe/watermelondb";
import MoodPicker from "./MoodPicker";
import { useEffect, useState } from "react";
import Note from "../model/Note";
import { updateMood } from "../utils/updateMood";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { editMood } from "../state/moodSlice";

export function NoteComponent({ props }: NoteProps) {
  const { day, editing, id } = props;
  const [moodPicker, setMoodPicker] = useState(false);
  const [moodType, setMoodType] = useState("");
  const moods = useAppSelector((state) => state.moods.value);
  //note fields
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const dispatch = useAppDispatch();
  const [existingNote, setExistingNote] = useState<Note[]>([]);

  useEffect(() => {
    console.log("useEffect triggered");
    // on load check if we're editing the note to update it
    if (editing) {
      async function handleEdit() {
        //if editing
        if (id !== "") {
          //check if id is provided
          console.log("id is provided");
          const noteInDB = [await database.get<Note>("notes").find(id)];
          setExistingNote(noteInDB);
        } else {
          //else get the day's note
          const noteInDB = await database
            .get<Note>("notes")
            .query(Q.where("day", day));
          console.log("setExistingNote called");
          setExistingNote(noteInDB);
        }
      }
      handleEdit();
    }
  }, [editing]);
  useEffect(() => {
    console.log("existingNote updated");
    console.log(existingNote);
    if (existingNote.length > 0) {
      setTitle(existingNote[0].title);
      setText(existingNote[0].content);
    }
  }, [existingNote]);

  function setMoods(list: Moods) {
    dispatch(editMood(list));
  }

  function handleMoodPress(moodType: number) {
    setMoodType(JSON.stringify(moodType));
  }
  async function saveNote() {
    if (text == "") {
      //if text field is empty alert
      console.log("Cannot save, text field is empty");
    } else {
      if (editing) {
        //if editing
        //edit db
        const currentNote = existingNote[0];
        await database
          .write(async () => {
            await currentNote.update(() => {
              //!! For now all the fields will be updated. Later I'll need to only update changes !!
              currentNote.title = title;
              // currentNote.mood = parseInt(moodType);
              currentNote.content = text;
            });
          })
          .catch((error) => {
            console.log(error);
          })
          .then(() => {
            console.log("Note updated");
          });
      } else {
        //if there is already a note throw error
        const existingNote = await database
          .get<Note>("notes")
          .query(Q.where("day", day));
        if (existingNote.length > 0) {
          console.log(
            "Cannot create note, there is aleady a note for this day"
          );
        } else {
          //else create note
          await database
            .write(async () => {
              await database.get<Note>("notes").create((note) => {
                note.day = day;
                note.title = title;
                note.content = text;
              });
            })
            .catch((error) => {
              console.log(error);
            })
            .then(() => {
              console.log("Note created");
            });
        }
      }
    }
    //update mood
    if (moodType !== "") {
      await updateMood(parseInt(moodType), day);
      //update state
      let moodsList = { ...moods };
      moodsList[day] = parseInt(moodType);
      setMoods(moodsList);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.newNoteTitle}>
        <TextInput
          style={styles.newNoteTitleInput}
          placeholder="Title(optional)"
          value={title}
          onChangeText={setTitle}
        />
        <View>
          <Pressable
            onPress={() => setMoodPicker((prev) => !prev)}
            style={[
              styles.newNoteTitleMood,
              { backgroundColor: returnColor(moodType) },
            ]}
          ></Pressable>
          {moodPicker && (
            <View style={styles.newNoteMoodPicker}>
              <MoodPicker handlePress={handleMoodPress} />
              <Text style={{ color: "white" }}>Mood: {moodType}</Text>
            </View>
          )}
        </View>
        <Pressable onPress={saveNote}>
          <Text style={{ color: "white" }}>[Save]</Text>
        </Pressable>
      </View>
      <View style={styles.newNoteMain}>
        <TextInput
          value={text}
          onChangeText={setText}
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
    zIndex: 1,
  },
  newNoteTitleInput: {
    fontSize: 20,
    width: "80%",
    color: "white",
    paddingHorizontal: 5,
  },
  newNoteTitleMood: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "pink",
    borderWidth: 2,
    paddingHorizontal: 5,
  },
  newNoteMoodPicker: {
    borderWidth: 2,
    borderColor: "pink",
    backgroundColor: "black",
    position: "absolute",
    // width: 200,
    right: 0,
    top: 30,
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
