import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  TextInput,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { supabase } from "../utils/supabase";
import { palette } from "../utils/palette";
import { database } from "../utils/watermelon";
import { Session } from "@supabase/supabase-js";
import { syncDatabase } from "../utils/sync";
import { useAppDispatch } from "../state/hooks";
import Note from "../model/Note";
import { serializeNote } from "../utils/functions";
import { editNote } from "../state/noteSlice";
import Feeling from "../model/Feeling";
import { Moods } from "../types";
import { editMood } from "../state/moodSlice";
import AlertComponent from "./Alert";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const dispatch = useAppDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");

  async function reloadRedux() {
    //reload moods
    const moodsQuery = (await database
      .get("feelings")
      .query()
      .fetch()) as Feeling[];
    if (moodsQuery.length > 0) {
      let moodsList: Moods = {};
      moodsQuery.forEach((mood) => {
        moodsList[mood.day] = mood.type;
      });
      dispatch(editMood(moodsList));
    } else {
      dispatch(editMood({}));
    }
    //reload notes
    const notesQuery = (await database.get("notes").query().fetch()) as Note[];
    if (notesQuery.length > 0) {
      const serializedNotes = notesQuery.map((note) => serializeNote(note));
      dispatch(editNote(serializedNotes));
    } else {
      dispatch(editNote([]));
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event == "SIGNED_IN" && session) {
        //successfull login
        handleDataOnSignIn();
      }
    });
  }, []);

  async function handleDataOnSignIn() {
    // !! Make sure that session is not null !!
    setLoading(true);
    // query notes and moods
    const notes = await database.get("notes").query().fetchCount();

    const moods = await database.get("feelings").query().fetchCount();

    // if there is no local data
    if (notes == 0 && moods == 0) {
      // load user data with a sync call
      syncDatabase();
      reloadRedux();
      setLoading(false);
      // if there is local data
    } else if (session && session.user) {
      try {
        const {
          data: notesData,
          error: notesError,
          status: notesStatus,
        } = await supabase
          .from("notes")
          .select()
          .eq("user_id", session.user.id);
        if (notesError && notesStatus !== 406) {
          setLoading(false);
          throw notesError;
        }

        const {
          data: moodsData,
          error: moodsError,
          status: moodsStatus,
        } = await supabase
          .from("feelings")
          .select()
          .eq("user_id", session.user.id);
        if (moodsError && moodsStatus !== 406) {
          setLoading(false);
          throw moodsError;
        }
        // if the user doesn't have data on Supabase
        if (!notesData && !moodsData) {
          // call sync and sync local changes to Supabase
          await syncDatabase();
          setLoading(false);
          // if there is data on Supabase
        } else {
          const { error } = await supabase.auth.signOut();
          setLoading(false);
          setMessage(
            "for now it's not possible to merge local data with the server one, sorry"
          );
          setShowAlert(true);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          setMessage(error.message);
          setShowAlert(true);
        }
      }
    }
  }

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);

    setPassword("");
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      // Alert.alert(error.message);
      setMessage(error.message);
      setShowAlert(true);
    }
    // Alert.alert("Please check your inbox for email verification!");
    setMessage("Please check your inbox for email verification!");
    setShowAlert(true);
    setLoading(false);
    setPassword("");
  }

  return (
    <View style={styles.container}>
      <AlertComponent
        message={message}
        setShowAlert={setShowAlert}
        visible={showAlert}
      />
      <Text style={styles.title}>Sign in</Text>
      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.text}>Email</Text>
          <TextInput
            style={styles.input}
            autoComplete="email"
            inputMode="email"
            onChangeText={setEmail}
            value={email}
            placeholderTextColor={"gray"}
          />
        </View>
        <View>
          <Text style={styles.text}>Password</Text>
          <TextInput
            style={styles.input}
            autoComplete="password"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            placeholderTextColor={"gray"}
            onKeyPress={(key) => {
              if (key.nativeEvent.key == "Enter") signInWithEmail();
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          {!loading && (
            <Pressable
              style={[styles.button, styles.signIn]}
              onPress={signInWithEmail}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </Pressable>
          )}
          {!loading && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                margin: "auto",
              }}
            >
              <Text style={styles.signUpText}>New account?</Text>
              <Pressable
                style={[styles.button, styles.signUp]}
                onPress={signUpWithEmail}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    borderRadius: 7,
    width: "90%",
    backgroundColor: palette.accent,
    marginHorizontal: "auto",
    padding: 5,
  },
  title: {
    fontSize: 25,
    color: palette.background,
    fontFamily: "Inter_500Medium",
    marginBottom: 30,
    marginTop: 10,
    marginHorizontal: "auto",
  },
  text: {
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    color: palette.background,
  },
  input: {
    borderWidth: 2,
    borderRadius: 9,
    fontSize: 17,
    borderColor: "pink",
    fontFamily: "Inter_400Regular",
    padding: 5,
  },
  inputContainer: {
    width: "90%",
    gap: 10,
    marginHorizontal: "auto",
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    padding: 5,
    borderRadius: 7,
  },
  signIn: {
    backgroundColor: palette.primary,
    paddingVertical: 9,
  },
  signUp: {
    backgroundColor: palette.rose,
  },
  signUpText: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
  },
  buttonText: {
    color: palette.text,
    fontFamily: "Inter_400Regular",
    fontSize: 17,
    margin: "auto",
  },
});
