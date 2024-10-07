import { View, StyleSheet, useWindowDimensions } from "react-native";
import Auth from "../components/Auth";
import { dynamicTheme } from "../utils/palette";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import UserPage from "../components/UserPage";
import AlertComponent from "../components/Alert";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import Setting from "../model/Setting";
import { database } from "../utils/watermelon";
import { syncDatabase } from "../utils/sync";
import { editMood } from "../state/moodSlice";
import { onMonthChange } from "../utils/month-functions";
import { toDateData } from "../utils/functions";
import reloadNotes from "../utils/reload-notes";

export default function Screen() {
  const [session, setSession] = useState<Session | null>(null);
  const { height } = useWindowDimensions();
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("Error");
  const [alertGiveChoice, setAlertGiveChoice] = useState(false);
  const [loginPressed, setLoginPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  const settings = useAppSelector((state) => state.settings as Setting[]);
  const moods = useAppSelector((state) => state.moods.value);
  const dispatch = useAppDispatch();

  async function reloadRedux() {
    //reload moods
    dispatch(editMood({}));
    onMonthChange({ date: toDateData(), moods, dispatch });
    //reload notes
    reloadNotes({ dispatch });
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // if (_event == 'SIGNED_IN' && session && session.user ) {
      // }
      if (_event == "SIGNED_OUT") {
        console.log("signed out");
        setLoginPressed(false);
      }
    });
  }, []);

  function handleLoginPress(state: boolean) {
    setLoginPressed(state);
  }

  // a function to display a message, with no options to chose from
  function setAlert(message: string) {
    setMessage(message);
    setAlertGiveChoice(false);
    setShowAlert(true);
  }

  useEffect(() => {
    if (loginPressed && session && session.user) {
      handleDataOnSignIn(session);
    }
  }, [session]);

  async function handleDataOnSignIn(nextSession: Session) {
    console.log("handle data on sign in");
    // query notes and moods
    const notes = await database.get("notes").query().fetchCount();

    const moods = await database.get("feelings").query().fetchCount();

    // if there is no local data
    if (notes == 0 && moods == 0) {
      // load user data with a sync call
      console.log("no local data, sync");
      await syncDatabase();
      reloadRedux();
      setLoading(false);
      // if there is local data
    } else if (nextSession && nextSession.user) {
      try {
        const {
          count: notesCount,
          error: notesError,
          status: notesStatus,
        } = await supabase
          .from("notes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", nextSession.user.id);
        if (notesError && notesStatus !== 406) {
          setLoading(false);
          throw notesError;
        }

        const {
          count: moodsCount,
          error: moodsError,
          status: moodsStatus,
        } = await supabase
          .from("feelings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", nextSession.user.id);
        if (moodsError && moodsStatus !== 406) {
          setLoading(false);
          throw moodsError;
        }
        // if the user doesn't have data on Supabase
        ///
        console.log("checking if there is data on Supabase: ");
        console.log("notesData: " + notesCount);
        console.log("moodsData: " + moodsCount);
        ///
        if (!notesCount && !moodsCount) {
          // call sync and sync local changes to Supabase
          console.log("No data on Supabase, syncing");
          await syncDatabase(true);
          setLoading(false);
          // if there is data on Supabase
        } else {
          console.log("there is data on Supabase! Logging out");
          const { error } = await supabase.auth.signOut();
          setLoading(false);
          setAlert(
            "for now it's not possible to merge local data with the server one, sorry"
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          setMessage(error.message);
          setShowAlert(true);
        }
      }
    }
    setLoading(false);
    // setLoginPressed(false);
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: dynamicTheme(settings, "background"),
        },
      ]}
    >
      <AlertComponent
        message={message}
        setShowAlert={setShowAlert}
        visible={showAlert}
        giveChoice={alertGiveChoice}
        handleConfirm={() => console.log("Confimed")}
        handleExit={() => console.log("Denied")}
      />
      <View
        style={{
          marginTop: height / 5,
          width: "100%",
        }}
      >
        {session && session.user ? (
          <UserPage />
        ) : (
          <View style={styles.auth}>
            <Auth setLoginPressed={handleLoginPress} setAlert={setAlert} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: palette.background,
    height: "100%",
    alignItems: "center",
  },
  auth: {
    height: "50%",
    width: "100%",
  },
});
