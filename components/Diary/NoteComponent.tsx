import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  useWindowDimensions,
} from "react-native";
import {
  fullDate,
  getCurrentDate,
  returnColor,
  serializeNote,
} from "../../utils/functions";
import { NoteProps, SerializedNote } from "../../types";
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
import { router, useNavigation, useSegments } from "expo-router";
import { editNote } from "../../state/noteSlice";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AlertComponent from "../Alert";
import Button from "../Button";
import reloadNotes from "../../utils/reload-notes";

export function NoteComponent({ props }: NoteProps) {
  const { day, editing, id } = props;
  const [moodPicker, setMoodPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertGiveChoice, setAlertGiveChoice] = useState(true);
  const [message, setMessage] = useState("");
  const [moodType, setMoodType] = useState("");
  const moods = useAppSelector((state) => state.moods.value);
  const notes = useAppSelector((state) => state.notes as SerializedNote[]);
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
            .query(Q.where("day", updatedDay));
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
            .query(Q.where("day", updatedDay));
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
        if (currentNote.title !== title) {
          updateNoteField("title", title);
          updateRedux("title", title);
        }
        if (currentNote.content !== text) {
          updateNoteField("content", text);
          // updateRedux("content", text);
        }
        async function updateNoteField(
          field: "title" | "content",
          value: string
        ) {
          await database
            .write(async () => {
              await currentNote.update(() => {
                currentNote[field] = value;
              });
            })
            .catch((error) => {
              console.log(error);
            })
            .then(() => {
              console.log("Note updated");
            });
        }
        //update redux
        function updateRedux(field: "title" | "content", value: string) {
          let notesCopy = [...notes];
          // find note and update it
          const index = notesCopy.findIndex((element) => {
            return element.id == currentNote.id;
          });
          notesCopy[index] = { ...notesCopy[index], [field]: value };
          dispatch(editNote(notesCopy));
        }
      } else {
        //if there is already a note throw error
        const existingNote = await database
          .get<Note>("notes")
          .query(Q.where("day", updatedDay));
        if (existingNote.length > 0) {
          console.log(
            "Cannot create note, there is aleady a note for this day"
          );
        } else {
          //else create note
          await database
            .write(async () => {
              await database.get<Note>("notes").create((note) => {
                note.day = updatedDay;
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
          // update redux
          async function updateNotes() {
            let notesCopy = [...notes];
            const notesQuery = await database.get("notes").query().fetchIds();
            async function addNoteToRedux(id: string) {
              const noteToAdd = await database.get<Note>("notes").find(id);
              if (noteToAdd) {
                notesCopy.push(serializeNote(noteToAdd));
              }
            }
            for (const id of notesQuery) {
              if (!notesCopy.find((element) => element.id == id)) {
                await addNoteToRedux(id);
              }
            }
            dispatch(editNote(notesCopy));
          }
          updateNotes();
        }
      }
    }
    //update mood
    if (moodType !== "") {
      await updateMood(parseInt(moodType), updatedDay);
      //update state
      let moodsList = { ...moods };
      moodsList[updatedDay] = parseInt(moodType);
      dispatch(editMood(moodsList));
    }
  }

  function deletePressed() {
    if (editing) {
      setMessage("Are you sure you want to delete this note?");
      setAlertGiveChoice(true);
      setShowOptions(false);
      setShowAlert(true);
    } else {
      setAlertGiveChoice(false);
      setMessage("There is nothing to delete");
      setShowAlert(true);
    }
  }
  async function deleteNote() {
    if (editing) {
      try {
        await database.write(async () => {
          const noteInDB = await database
            .get<Note>("notes")
            .query(Q.where("day", updatedDay));
          noteInDB[0].markAsDeleted();
          setTitle("");
          setText("");
        });
      } catch (e) {
        setAlertGiveChoice(false);
        setMessage("Error");
        setShowAlert(true);
      }
    }
    //reload redux
    reloadNotes({ dispatch });
    //reroute to /Diary/
    router.navigate("/Diary/");
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
      <AlertComponent
        message={message}
        setShowAlert={setShowAlert}
        visible={showAlert}
        giveChoice={alertGiveChoice}
        handleConfirm={deleteNote}
        handleExit={() => {}}
      />
      <View style={styles.newNoteTitle}>
        <TextInput
          style={styles.newNoteTitleInput}
          placeholder="Title (optional)"
          placeholderTextColor={palette.gray}
          value={title}
          onChangeText={setTitle}
        />
        <Pressable onPress={saveNote} style={styles.save}>
          <Text style={styles.newNoteSave}>Save</Text>
        </Pressable>
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
        <View>
          <Pressable
            onPress={() => {
              setShowOptions((prev) => !prev);
            }}
            style={styles.optionsIcon}
          >
            <SimpleLineIcons name="options" size={24} color="black" />
          </Pressable>
          {showOptions && (
            <View style={styles.newNoteOptions}>
              <Button
                text="Delete Note"
                onPress={deletePressed}
                color="black"
              />
            </View>
          )}
        </View>
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
  save: {
    paddingRight: 5,
  },
  optionsIcon: {
    paddingLeft: 4,
  },
  newNoteOptions: {
    borderWidth: 3,
    padding: 2,
    borderColor: "pink",
    backgroundColor: palette.accent,
    position: "absolute",
    right: 0,
    top: 35,
  },
  newNoteSave: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
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
