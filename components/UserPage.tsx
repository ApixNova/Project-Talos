import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Setting from "../model/Setting";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";
import { supabase } from "../utils/supabase";
import { syncDatabase } from "../utils/sync";
import { database } from "../utils/watermelon";
import AlertComponent from "./Alert";
import { editMood } from "../state/moodSlice";
import { onMonthChange } from "../utils/month-functions";
import { toDateData } from "../utils/functions";
import reloadNotes from "../utils/reload-notes";

export default function UserPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
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
    await syncDatabase();
    dispatch(editMood({}));
    onMonthChange({ date: toDateData(), moods, dispatch });
    reloadNotes({ dispatch });
  }

  function clearLocalData() {
    // syncDatabase
    database.write(async () => {
      database.unsafeResetDatabase();
    });
  }
  async function handleSignOutPress() {
    const notes = await database.get("notes").query().fetchCount();
    const moods = await database.get("feelings").query().fetchCount();
    //if there's data
    if (notes == 0 && moods == 0) {
      signOut();
    } else {
      //ask user before logging off
      setMessage("Would you like to remove local data?");
      setShowAlert(true);
    }
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut();
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
        giveChoice
        handleConfirm={() => {
          console.log("WIP ;)");
        }}
        handleExit={signOut}
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
          <Pressable
            onPress={handleSync}
            style={{
              backgroundColor: "pink",
              padding: 5,
              borderRadius: 10,
            }}
          >
            <Text>Sync</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: dynamicTheme(settings, "rose") },
            ]}
            onPress={handleSignOutPress}
          >
            <Text style={styles.text}>Log out</Text>
          </Pressable>
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
