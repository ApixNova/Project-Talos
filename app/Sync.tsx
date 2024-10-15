import { View, StyleSheet, useWindowDimensions } from "react-native";
import Auth from "../components/Auth";
import { dynamicTheme } from "../utils/palette";
import { useEffect, useState } from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import UserPage from "../components/UserPage";
import AlertComponent from "../components/Alert";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import Setting from "../model/Setting";
import { database } from "../utils/watermelon";
import { syncDatabase } from "../utils/sync";
import { editMood } from "../state/moodSlice";
import { onMonthChange } from "../utils/month-functions";
import { setupSettings, toDateData } from "../utils/functions";
import reloadNotes from "../utils/reload-notes";
import { editNote } from "../state/noteSlice";

export default function Screen() {
  const [session, setSession] = useState<
    [Session | null, AuthChangeEvent | null]
  >([null, null]);
  const { height } = useWindowDimensions();
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("Error");
  const [alertGiveChoice, setAlertGiveChoice] = useState(false);
  const [alertConfirm, setAlertConfirm] = useState<() => void>(() => {});
  const [alertExit, setAlertExit] = useState<() => void>(() => {});
  const [alertLabel, setAlertLabel] = useState("");
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
      setSession([session, null]);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession([session, _event]);
      if (_event == "SIGNED_OUT") {
        console.log("signed out");
        setLoginPressed(false);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  function handleLoginPress(state: boolean) {
    setLoginPressed(state);
  }

  // a function to display a message, with no options to chose from
  function setAlert(message: string) {
    setMessage(message);
    setAlertLabel("");
    setAlertGiveChoice(false);
    setAlertConfirm(() => {});
    setAlertExit(() => {});
    setShowAlert(true);
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

  function alertOnSignout(signOut: () => Promise<void>) {
    setMessage(
      "Would you like to remove local data?\nYour data is still saved on the server"
    );

    setAlertGiveChoice(true);
    setAlertExit(() => () => {
      signOut();
    });
    setAlertConfirm(() => () => {
      clearLocalData().then(() => {
        signOut();
      });
    });
    setShowAlert(true);
  }

  function mailConfirmationAlert(mail: string) {
    //ask the user if they want to reset their mail
    setMessage("It seems your confirmation link has expired");
    setAlertGiveChoice(true);
    setAlertLabel("Resend Confirmation Link");
    setAlertConfirm(() => () => resendMailLink(mail));
    setAlertExit(() => {});
    setShowAlert(true);
  }

  async function resendMailLink(mail: string) {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: mail,
      options: {
        emailRedirectTo: "http://localhost:8081/MailConfirmation",
      },
    });
    if (error) {
      setAlert("Error: Request Failed");
    } else {
      setAlert("Please check your inbox for email verification!");
    }
  }

  useEffect(() => {
    const currentSession = session[0];
    const event = session[1];
    if (
      loginPressed &&
      currentSession &&
      currentSession.user &&
      event != "TOKEN_REFRESHED"
    ) {
      handleDataOnSignIn(currentSession);
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
      await syncDatabase(setAlert, true);
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
          setAlert("Error: " + notesError.message);
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
          setAlert("Error: " + moodsError.message);
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
          await syncDatabase(setAlert, true);
          setLoading(false);
          // if there is data on Supabase
        } else {
          console.log(
            "there is data on Supabase! Syncing and resolving conflicts..."
          );
          await syncDatabase(setAlert, false, session[0]);
          setLoading(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          setAlert(error.message);
        }
      }
    }
    setLoading(false);
    setLoginPressed(false);
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
        handleConfirm={alertConfirm}
        handleExit={alertExit}
        confirmLabel={alertLabel == "" ? undefined : alertLabel}
      />
      <View
        style={{
          marginTop: height / 5,
          width: "100%",
        }}
      >
        {session[0] && session[0].user ? (
          <UserPage setAlert={setAlert} alertOnSignout={alertOnSignout} />
        ) : (
          <View style={styles.auth}>
            <Auth
              setLoginPressed={handleLoginPress}
              setAlert={setAlert}
              mailConfirmationAlert={mailConfirmationAlert}
            />
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
