import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { StyleSheet, View } from "react-native";
import { palette } from "../utils/palette";
import { useEffect } from "react";
import { database } from "../utils/watermelon";
import Note from "../model/Note";
import {
  serializeNote,
  serializeSetting,
  setupSettings,
} from "../utils/functions";
import { useAppDispatch } from "../state/hooks";
import { editNote } from "../state/noteSlice";
import { editMood } from "../state/moodSlice";
import Feeling from "../model/Feeling";
import { Moods } from "../types";
import Setting from "../model/Setting";
import { editSetting } from "../state/settingSlice";

export default function MyDrawer(props: DrawerContentComponentProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //on load query notes, moods and setting tables
    async function getNotes() {
      const notesQuery = (await database
        .get("notes")
        .query()
        .fetch()) as Note[];
      //serialize notes for redux
      const serializedNotes = notesQuery.map((note) => serializeNote(note));
      dispatch(editNote(serializedNotes));
    }
    getNotes();
    // async function getMoods() {
    //   const moodsQuery = (await database
    //     .get("feelings")
    //     .query()
    //     .fetch()) as Feeling[];
    //   let moodsList: Moods = {};
    //   moodsQuery.forEach((mood) => {
    //     moodsList[mood.day] = mood.type;
    //   });
    //   dispatch(editMood(moodsList));
    // }
    // getMoods();
    async function getSettings() {
      const settingsQuery = (await database
        .get("settings")
        .query()
        .fetch()) as Setting[];
      setupSettings();
      const serializedSettings = settingsQuery.map((setting) =>
        serializeSetting(setting)
      );
      dispatch(editSetting(serializedSettings));
    }
    getSettings();
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
