import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { StyleSheet, View } from "react-native";
import { palette } from "../utils/palette";
import { useEffect } from "react";
import { database } from "../utils/watermelon";
import { serializeSetting, setupSettings } from "../utils/functions";
import { useAppDispatch } from "../state/hooks";
import Setting from "../model/Setting";
import { editSetting } from "../state/settingSlice";
import reloadNotes from "../utils/reload-notes";

export default function MyDrawer(props: DrawerContentComponentProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    //on load query the last 10 notes and setting tables
    reloadNotes({ dispatch });

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
