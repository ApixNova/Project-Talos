import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Setting from "../model/Setting";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { toDateData } from "../utils/functions";
import { onMonthChange } from "../utils/month-functions";
import { dynamicTheme } from "../utils/palette";
import reloadNotes from "../utils/reload-notes";
import { supabase } from "../utils/supabase";
import { syncDatabase } from "../utils/sync";
import { database } from "../utils/watermelon";
import AlertComponent from "./Alert";
import Button from "./Button";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const moods = useAppSelector((state) => state.moods.value);
  const dispatch = useAppDispatch();

  const settings = useAppSelector((state) => state.settings as Setting[]);

  async function reloadRedux() {
    //reload moods
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
      if (_event == "SIGNED_IN" && session) {
        //successfull login
        handleDataOnSignIn();
      }
    });
  }, []);

  async function handleDataOnSignIn() {
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
      />
      <Text
        style={[styles.title, { color: dynamicTheme(settings, "background") }]}
      >
        Sign in
      </Text>
      <View style={styles.inputContainer}>
        <View>
          <Text
            style={[
              styles.text,
              { color: dynamicTheme(settings, "background") },
            ]}
          >
            Email
          </Text>
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
          <Text
            style={[
              styles.text,
              { color: dynamicTheme(settings, "background") },
            ]}
          >
            Password
          </Text>
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
            <Button
              text="Sign In"
              onPress={signInWithEmail}
              style={styles.signIn}
            />
          )}
          {!loading && (
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>New account?</Text>
              <Button
                text="Sign Up"
                onPress={signUpWithEmail}
                color={dynamicTheme(settings, "rose")}
              />
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
    // backgroundColor: palette.accent,
    marginHorizontal: "auto",
    padding: 5,
  },
  title: {
    fontSize: 25,
    // color: palette.background,
    fontFamily: "Inter_500Medium",
    marginBottom: 30,
    marginTop: 10,
    marginHorizontal: "auto",
  },
  text: {
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    // color: palette.background,
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
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: "auto",
  },
  signIn: {
    paddingVertical: 9,
  },
  signUpText: {
    fontSize: 17,
    fontFamily: "Inter_500Medium",
  },
});
