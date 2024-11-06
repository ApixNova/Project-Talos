import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Q } from "@nozbe/watermelondb";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Feeling from "../../model/Feeling";
import Note from "../../model/Note";
import Setting from "../../model/Setting";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { editMood } from "../../state/moodSlice";
import { editNote } from "../../state/noteSlice";
import { NoteProps, SerializedNote } from "../../types";
import {
  fullDate,
  getCurrentDate,
  returnColor,
  serializeNote,
} from "../../utils/functions";
import { dynamicTheme } from "../../utils/palette";
import reloadNotes from "../../utils/reload-notes";
import { updateMood } from "../../utils/updateMood";
import { database } from "../../utils/watermelon";
import AlertComponent from "../Alert";
import Button from "../Button";
import MoodPicker from "../Moods/MoodPicker";

export function NoteComponent({ props }: NoteProps) {
  const { day, id } = props;
  const [moodPicker, setMoodPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [save, setSave] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertGiveChoice, setAlertGiveChoice] = useState(true);
  const [message, setMessage] = useState("");
  const [moodType, setMoodType] = useState("");
  const [alertExit, setAlertExit] = useState<() => void>(() => {});
  const moods = useAppSelector((state) => state.moods.value);
  const settings = useAppSelector((state) => state.settings as Setting[]);
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
    let noteCopy: Note[];
    async function handleEdit() {
      if (id !== "") {
        //check if id is provided
        try {
          const noteInDB = [await database.get<Note>("notes").find(id)];
          setExistingNote(noteInDB);
          noteCopy = [...noteInDB];
          setUpdatedDay(noteCopy[0].day);
        } catch (error) {
          // alert and reroute
          setMessage("Note Not Found");
          setAlertGiveChoice(false);
          setAlertExit(() => () => {
            router.navigate("/Diary/");
          });
          setShowAlert(true);
        }
      } else {
        //else get the day's note
        const noteInDB = await database
          .get<Note>("notes")
          .query(Q.where("day", updatedDay));
        if (noteInDB.length > 0) {
          setExistingNote(noteInDB);
          noteCopy = [...noteInDB];
          setUpdatedDay(noteCopy[0].day);
        } else if (existingNote.length > 0) {
          setExistingNote([]);
        }
      }
      //get the day's mood if existing
      if (noteCopy) {
        const moodInDB = await database
          .get<Feeling>("feelings")
          .query(Q.where("day", noteCopy[0].day));
        if (moodInDB.length > 0) {
          setMoodType(JSON.stringify(moodInDB[0].type));
        }
      }
    }
    handleEdit();
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
  }, [notes]);

  useEffect(() => {
    if (existingNote.length > 0) {
      setTitle(existingNote[0].title);
      setText(existingNote[0].content);
    } else {
      setMoodType("");
      setTitle("");
      setText("");
    }
  }, [existingNote]);

  function handleMoodPress(moodType: number) {
    setMoodType(JSON.stringify(moodType));
    setMoodPicker(false);
  }

  function handleChangeText(value: string, type: "title" | "content") {
    function isValid() {
      return type == "title" ? true : value != "";
    }
    function titleValue() {
      return type == "title" ? value : title;
    }
    function textValue() {
      return type == "title" ? text : value;
    }
    if (isValid() && existingNote.length > 0) {
      const currentNote = existingNote[0];
      if (
        textValue() != "" &&
        (currentNote.title !== titleValue() ||
          currentNote.content !== textValue())
      ) {
        setSave(true);
      } else {
        setSave(false);
      }
    } else if (textValue() != "") {
      setSave(true);
    } else {
      setSave(false);
    }
  }
  async function saveNote() {
    if (text != "") {
      if (existingNote.length > 0) {
        //if editing
        //edit db
        const currentNote = existingNote[0];
        if (currentNote.title !== title) {
          updateNoteField("title", title);
          updateRedux("title", title);
        }
        if (currentNote.content !== text) {
          updateNoteField("content", text);
          updateRedux("content", text);
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
              setAlert(error);
            })
            .then(() => {
              setSave(false);
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
          setAlert("Cannot create note, there is aleady a note for this day");
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
              setAlert(error);
            })
            .then(() => {
              setSave(false);
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
      let moodsList = JSON.parse(JSON.stringify(moods));
      moodsList[updatedDay] = parseInt(moodType);
      dispatch(editMood(moodsList));
    }
  }

  function deletePressed() {
    if (existingNote.length > 0) {
      setMessage("Are you sure you want to delete this note?");
      setAlertGiveChoice(true);
      setShowOptions(false);
      setAlertExit(() => () => {});
      setShowAlert(true);
    } else {
      setAlertGiveChoice(false);
      setMessage("There is nothing to delete");
      setAlertExit(() => () => {});
      setShowAlert(true);
    }
  }
  async function deleteNote() {
    if (existingNote.length > 0) {
      try {
        await database.write(async () => {
          const noteInDB = await database
            .get<Note>("notes")
            .query(Q.where("day", updatedDay));
          noteInDB[0].markAsDeleted();
          setTitle("");
          setText("");
          setAlert("Note Deleted");
        });
      } catch (e) {
        setAlert("Error" + e);
      }
    }
    //reload redux
    reloadNotes({ dispatch });
    //reroute to /Diary/
    router.navigate("/Diary/");
  }
  function setAlert(message: string) {
    setAlertGiveChoice(false);
    setMessage(message);
    setAlertExit(() => () => {});
    setShowAlert(true);
  }
  return (
    <View
      style={[
        styles.container,
        {
          width: width < 1200 ? "100%" : "80%",
          maxWidth: 1500,
          backgroundColor: dynamicTheme(settings, "secondary"),
          borderColor: dynamicTheme(settings, "text"),
        },
      ]}
    >
      <AlertComponent
        message={message}
        setShowAlert={setShowAlert}
        visible={showAlert}
        giveChoice={alertGiveChoice}
        handleConfirm={deleteNote}
        handleExit={alertExit}
      />
      <View
        style={[
          styles.newNoteTitle,
          {
            backgroundColor: dynamicTheme(settings, "secondary"),
          },
        ]}
      >
        <TextInput
          style={[
            styles.newNoteTitleInput,
            {
              color: dynamicTheme(settings, "text"),
            },
          ]}
          placeholder="Title (optional)"
          placeholderTextColor={dynamicTheme(settings, "gray")}
          value={title}
          onChangeText={(value) => {
            setTitle(value);
            handleChangeText(value, "title");
          }}
        />
        {save && (
          <Pressable onPress={saveNote} style={styles.save}>
            <Text style={styles.newNoteSave}>Save</Text>
          </Pressable>
        )}
        <View>
          <Pressable
            onPress={() => setMoodPicker((prev) => !prev)}
            style={[
              styles.newNoteTitleMood,
              {
                backgroundColor: returnColor(moodType),
                borderColor: dynamicTheme(settings, "text"),
              },
            ]}
          ></Pressable>
          {moodPicker && (
            <View
              style={[
                styles.newNoteMoodPicker,
                {
                  backgroundColor: dynamicTheme(settings, "secondary"),
                  borderColor: dynamicTheme(settings, "text"),
                },
              ]}
            >
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
            <View
              style={[
                styles.newNoteOptions,
                { backgroundColor: dynamicTheme(settings, "secondary") },
              ]}
            >
              <Button
                text="Delete Note"
                onPress={deletePressed}
                color="black"
              />
            </View>
          )}
        </View>
      </View>
      <View
        style={[
          styles.newNoteMain,
          {
            backgroundColor: dynamicTheme(settings, "background"),
            borderColor: dynamicTheme(settings, "text"),
          },
        ]}
      >
        <TextInput
          value={text}
          onChangeText={(value) => {
            setText(value);
            handleChangeText(value, "content");
          }}
          placeholder="take a note about your day..."
          placeholderTextColor={dynamicTheme(settings, "gray")}
          style={[
            styles.newNoteInput,
            {
              color: dynamicTheme(settings, "text"),
            },
          ]}
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
    borderWidth: 2,
    borderRadius: 10,
  },
  newNoteTitle: {
    height: "10%",
    maxHeight: 50,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 5,
    zIndex: 1,
    flex: 1,
  },
  newNoteTitleInput: {
    fontSize: 21,
    width: "80%",
    paddingHorizontal: 5,
    marginRight: "auto",
    fontFamily: "Inter-Regular",
  },
  newNoteTitleMood: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  newNoteMoodPicker: {
    borderWidth: 2,
    padding: 2,
    position: "absolute",
    right: 0,
    top: 30,
  },
  save: {
    paddingRight: 5,
  },
  optionsIcon: {
    paddingLeft: 8,
  },
  newNoteOptions: {
    padding: 2,
    position: "absolute",
    right: 0,
    top: 35,
    minWidth: 130,
  },
  newNoteSave: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
  },
  newNoteMain: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 2,
    flex: 9,
  },
  newNoteInput: {
    color: "white",
    height: "100%",
    fontSize: 20,
    paddingHorizontal: 5,
    fontFamily: "Inter-Regular",
    textAlignVertical: "top",
  },
});
