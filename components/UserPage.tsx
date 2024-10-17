import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Setting from "../model/Setting";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";
import { supabase } from "../utils/supabase";
import { syncDatabase } from "../utils/sync";
import { database } from "../utils/watermelon";
import { editMood } from "../state/moodSlice";
import { onMonthChange } from "../utils/month-functions";
import { toDateData } from "../utils/functions";
import reloadNotes from "../utils/reload-notes";
import Button from "./Button";
import { UserPageProps } from "../types";

export default function UserPage({ setAlert, alertOnSignout }: UserPageProps) {
  const [session, setSession] = useState<Session | null>(null);
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const moods = useAppSelector((state) => state.moods.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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

  async function handleSync() {
    await syncDatabase(setAlert, false, session);
    dispatch(editMood({}));
    onMonthChange({ date: toDateData(), moods, dispatch });
    reloadNotes({ dispatch });
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
      await alertOnSignout(signOut);
    }
  }
  async function signOut() {
    console.log("signing out");
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      setAlert("Error: " + error.message);
    }
  }
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dynamicTheme(settings, "secondary") },
      ]}
    >
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
  },
  button: {
    padding: 5,
    borderRadius: 7,
  },
});
