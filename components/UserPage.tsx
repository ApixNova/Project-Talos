import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Setting from "../model/Setting";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";
import { supabase } from "../utils/supabase";
import { syncDatabase } from "../utils/sync";
import { database } from "../utils/watermelon";
import AlertComponent from "./Alert";
import { editMood } from "../state/moodSlice";
import { onMonthChange } from "../utils/month-functions";
import { setupSettings, toDateData } from "../utils/functions";
import reloadNotes from "../utils/reload-notes";
import Button from "./Button";
import { editNote } from "../state/noteSlice";

export default function UserPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [alertGiveChoice, setAlertGiveChoice] = useState(false);
  const [alertExit, setAlertExit] = useState<() => void>(() => {});
  const [alertConfirm, setAlertConfirm] = useState<() => void>(() => {});
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const moods = useAppSelector((state) => state.moods.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function handleSync() {
    await syncDatabase(setAlert);
    dispatch(editMood({}));
    onMonthChange({ date: toDateData(), moods, dispatch });
    reloadNotes({ dispatch });
  }

  async function clearLocalData() {
    // syncDatabase
    await syncDatabase(setAlert);
    await database
      .write(async () => {
        await database.unsafeResetDatabase();
      })
      .then(() => {
        setupSettings();
        //reload moods and notes
        dispatch(editMood({}));
        dispatch(editNote([]));
      });
    console.log("local data synced then cleared");
  }

  // a function to display a message, with no options to chose from
  function setAlert(message: string) {
    setMessage(message);
    setAlertGiveChoice(false);
    setAlertExit(() => {});
    setAlertConfirm(() => {});
    setShowAlert(true);
  }

  async function handleSignOutPress() {
    console.log("handleSignOutPress");
    const notes = await database.get("notes").query().fetchCount();
    const moods = await database.get("feelings").query().fetchCount();
    //if there's data
    if (notes == 0 && moods == 0) {
      signOut();
    } else {
      //ask user before loging off
      await syncDatabase(setAlert);
      setMessage(
        "Would you like to remove local data?\nYour data is still saved on the server"
      );

      setAlertGiveChoice(true);
      setAlertExit(() => signOut);
      setAlertConfirm(() => () => {
        clearLocalData().then(() => {
          signOut();
        });
      });
      setShowAlert(true);
    }
  }
  async function signOut() {
    console.log("signing out");
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAlert("Error: " + error.message);
    }
  }
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dynamicTheme(settings, "accent") },
      ]}
    >
      <AlertComponent
        message={message}
        setShowAlert={setShowAlert}
        visible={showAlert}
        giveChoice={alertGiveChoice}
        handleConfirm={alertConfirm}
        handleExit={alertExit}
      />
      {session && session.user && (
        <>
          <Text
            style={[
              styles.title,
              { color: dynamicTheme(settings, "background") },
            ]}
          >
            {session.user.email}
          </Text>
          <Button
            text="Sync"
            onPress={handleSync}
            color={dynamicTheme(settings, "primary")}
          />
          <Button
            text="Log out"
            onPress={handleSignOutPress}
            color={dynamicTheme(settings, "rose")}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: palette.accent,
    height: "100%",
    width: "80%",
    maxWidth: 600,
    // justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: "auto",
    gap: 20,
    padding: 5,
    borderRadius: 7,
  },
  title: {
    // color: palette.background,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  text: {
    color: "white",
    fontFamily: "Inter_400Regular",
  },
  auth: {
    // marginTop: "10%",
    height: "50%",
    width: "100%",
    // backgroundColor: "pink",
  },
  button: {
    // backgroundColor: palette.rose,
    padding: 5,
    borderRadius: 7,
  },
});
