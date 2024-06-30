import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { StyleSheet, View } from "react-native";
import { palette } from "../utils/palette";
import drawer from "expo-router/drawer";
import { useEffect } from "react";
import { database } from "../utils/watermelon";
import Note from "../model/Note";
import { serializeNote } from "../utils/functions";
import { useAppDispatch } from "../state/hooks";
import { editNote } from "../state/noteSlice";
import { editMood } from "../state/moodSlice";
import Feeling from "../model/Feeling";
import { Moods } from "../types";

export default function MyDrawer(props: DrawerContentComponentProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //on load query notes and mood table
    async function getNotes() {
      const notesQuery = (await database
        .get("notes")
        .query()
        .fetch()) as Note[];
      console.log(notesQuery);
      //serialize notes for redux
      const serializedNotes = notesQuery.map((note) => serializeNote(note));
      dispatch(editNote(serializedNotes));
    }
    getNotes();
    async function getMoods() {
      const moodsQuery = (await database
        .get("feelings")
        .query()
        .fetch()) as Feeling[];
      let moodsList: Moods = {};
      moodsQuery.forEach((mood) => {
        moodsList[mood.day] = mood.type;
      });
      dispatch(editMood(moodsList));
    }
    getMoods();
  }, []);
  return (
    <DrawerContentScrollView {...props} style={styles.drawer}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: palette.background,
    borderRightWidth: 3,
    borderColor: palette.rose,
  },
});
