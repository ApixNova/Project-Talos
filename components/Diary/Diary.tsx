import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { fullDate, getCurrentDate, serializeNote } from "../../utils/functions";
import { FlashList } from "@shopify/flash-list";
import { NoteComponent } from "./NoteComponent";
import { useEffect, useState } from "react";
import { NotePreview } from "./NotePreview";
import { SerializedNote } from "../../types";
import { useAppSelector } from "../../state/hooks";
import { palette } from "../../utils/palette";
import NewNoteCalendar from "./NewNoteCalendar";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export function Diary() {
  const notes = useAppSelector((state) => state.notes as SerializedNote[]);
  const [editing, setEditing] = useState(false);
  const [newNoteMenu, setNewNoteMenu] = useState(false);
  const rotateZ = useSharedValue("0deg");

  function onPressNewNote() {
    setNewNoteMenu(true);
  }

  useEffect(() => {
    if (newNoteMenu) {
      rotateZ.value = withSpring("45deg");
    } else {
      rotateZ.value = withSpring("0deg");
    }
  }, [newNoteMenu]);

  function sortedNotes() {
    return notes.slice().sort((a, b) => {
      return new Date(b.day).getTime() - new Date(a.day).getTime();
    });
  }

  function havingNotes() {
    return notes.length > 0;
  }

  useEffect(() => {
    if (havingNotes()) {
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
      <Text style={styles.mainTitle}>{fullDate(getCurrentDate())}</Text>
      <View
        style={[
          styles.noteContainer,
          { height: havingNotes() ? "50%" : "80%" },
        ]}
      >
        <NoteComponent
          props={{ day: getCurrentDate(), editing: editing, id: "" }}
        />
      </View>
      <View style={styles.noteList}>
        {havingNotes() && (
          <FlashList
            data={sortedNotes()}
            renderItem={({ item }) => {
              return <NotePreview data={item} />;
            }}
            estimatedItemSize={38}
            indicatorStyle="black"
            ListFooterComponent={<View style={styles.listFooter}></View>}
          />
        )}
      </View>
      <Pressable style={styles.newEntry} onPress={onPressNewNote}>
        <Animated.View
          style={{
            transform: [{ rotateZ }],
            margin: "auto",
          }}
        >
          <FontAwesome
            style={styles.plus}
            name="plus"
            size={30}
            color="black"
          />
        </Animated.View>
      </Pressable>

      {newNoteMenu && <NewNoteCalendar props={{ setNewNoteMenu }} />}
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
  },
  noteList: {
    marginVertical: 10,
    width: "100%",
    height: "40%",
  },
  listFooter: {
    height: 60,
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
