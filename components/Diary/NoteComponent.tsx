import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { fullDate, getCurrentDate, returnColor } from "../../utils/functions";
import { NoteProps } from "../../types";
import { database } from "../../utils/watermelon";
import { Q } from "@nozbe/watermelondb";
import MoodPicker from "../Moods/MoodPicker";
import { useEffect, useState } from "react";
import Note from "../../model/Note";
import { updateMood } from "../../utils/updateMood";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { editMood } from "../../state/moodSlice";
import { palette } from "../../utils/palette";
import Feeling from "../../model/Feeling";
import { useNavigation } from "expo-router";

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
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [updatedDay, setUpdatedDay] = useState(
    day !== "" ? day : getCurrentDate()
  );

  useEffect(() => {
    navigation.setOptions({ title: fullDate(updatedDay) });
  }, [updatedDay]);

  useEffect(() => {
    // on load check if we're editing the note to update it
    let noteCopy;
    if (editing) {
      async function handleEdit() {
        //if editing
        if (id !== "") {
          //check if id is provided
          const noteInDB = [await database.get<Note>("notes").find(id)];
          setExistingNote(noteInDB);
          noteCopy = [...noteInDB];
          setUpdatedDay(noteCopy[0].day);
        } else {
          //else get the day's note
          const noteInDB = await database
            .get<Note>("notes")
            .query(Q.where("day", day));
          setExistingNote(noteInDB);
          noteCopy = [...noteInDB];
          setUpdatedDay(noteCopy[0].day);
        }
        //get the day's mood if existing
        const moodInDB = await database
          .get<Feeling>("feelings")
          .query(Q.where("day", noteCopy[0].day));
        if (moodInDB.length > 0) {
          setMoodType(JSON.stringify(moodInDB[0].type));
        }
      }
      handleEdit();
    } else {
      if (day !== "") {
        async function getDayMood() {
          const moodInDB = await database
            .get<Feeling>("feelings")
            .query(Q.where("day", day));
          if (moodInDB.length > 0) {
            setMoodType(JSON.stringify(moodInDB[0].type));
          }
        }
        getDayMood();
      }
    }
  }, [editing]);

  useEffect(() => {
    if (existingNote.length > 0) {
      setTitle(existingNote[0].title);
      setText(existingNote[0].content);
    }
  }, [existingNote]);

  function handleMoodPress(moodType: number) {
    setMoodType(JSON.stringify(moodType));
    setMoodPicker(false);
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
      dispatch(editMood(moodsList));
    }
  }
  return (
    <View
      style={[
        styles.container,
        {
          width: width < 1200 ? "100%" : "80%",
          maxWidth: 1500,
        },
      ]}
    >
      <View style={styles.newNoteTitle}>
        <TextInput
          style={styles.newNoteTitleInput}
          placeholder="Title (optional)"
          placeholderTextColor={palette.gray}
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
            </View>
          )}
        </View>
        <Pressable onPress={saveNote}>
          <Text style={styles.newNoteSave}>[Save]</Text>
        </Pressable>
      </View>
      <View style={styles.newNoteMain}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="take a note about your day..."
          placeholderTextColor={palette.gray}
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
    marginHorizontal: "auto",
    height: "100%",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "pink",
    backgroundColor: palette.accent,
  },
  newNoteTitle: {
    backgroundColor: palette.accent,
    height: "10%",
    maxHeight: 50,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    zIndex: 1,
    flex: 1,
  },
  newNoteTitleInput: {
    fontSize: 21,
    width: "80%",
    color: palette.text,
    paddingHorizontal: 5,
    fontFamily: "Inter_400Regular",
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
    borderWidth: 3,
    padding: 2,
    borderColor: "pink",
    backgroundColor: palette.accent,
    position: "absolute",
    right: 0,
    top: 30,
  },
  newNoteSave: {
    fontFamily: "Inter_400Regular",
  },
  newNoteMain: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: palette.background,
    padding: 2,
    flex: 9,
  },
  newNoteInput: {
    color: "white",
    height: "100%",
    fontSize: 20,
    paddingHorizontal: 5,
    fontFamily: "Inter_400Regular",
  },
});
