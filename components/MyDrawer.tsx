import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Setting from "../model/Setting";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { editSetting } from "../state/settingSlice";
import { serializeSetting, setupSettings } from "../utils/functions";
import { dynamicTheme } from "../utils/palette";
import reloadNotes from "../utils/reload-notes";
import { database } from "../utils/watermelon";
import AlertComponent from "./Alert";
import { supabase } from "../utils/supabase";

export default function MyDrawer(props: DrawerContentComponentProps) {
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
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
    // we also check if the session is valid
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event == "INITIAL_SESSION") {
        async function checkSession() {
          const { data, error } = await supabase.auth.refreshSession();
          // If there is an error, the session is invalid
          if (error) {
            setAlert("Session is invalid or expired, you've been logged out");
            console.log(error.message);
            return;
          }
        }
        checkSession();
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  function setAlert(message: string) {
    setMessage(message);
    setShowAlert(true);
  }
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
      <AlertComponent
        message={message}
        setShowAlert={setShowAlert}
        visible={showAlert}
      />
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
