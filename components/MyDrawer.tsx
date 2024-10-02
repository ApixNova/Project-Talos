import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Setting from "../model/Setting";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { editSetting } from "../state/settingSlice";
import { serializeSetting, setupSettings } from "../utils/functions";
import { dynamicTheme } from "../utils/palette";
import reloadNotes from "../utils/reload-notes";
import { database } from "../utils/watermelon";

export default function MyDrawer(props: DrawerContentComponentProps) {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings as Setting[]);
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
    <DrawerContentScrollView
      {...props}
      style={[
        styles.drawer,
        {
          backgroundColor: dynamicTheme(settings, "background"),
          borderColor: dynamicTheme(settings, "rose"),
        },
      ]}
    >
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    // backgroundColor: palette.background,
    borderRightWidth: 3,
    // borderColor: palette.rose,
  },
});
