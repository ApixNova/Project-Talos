import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Setting from "../model/Setting";
import { useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";
import { supabase } from "../utils/supabase";
import Button from "./Button";
import { AuthProps } from "../types";

export default function Auth({
  setLoginPressed,
  setAlert,
  mailConfirmationAlert,
}: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const settings = useAppSelector((state) => state.settings as Setting[]);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoginPressed(true);

    if (error) {
      if (error.message == "Email not confirmed") {
        mailConfirmationAlert(email);
      } else {
        setAlert("Error: " + error.message);
      }
    }
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
      options: {
        emailRedirectTo: "https://talostheapp.com/MailConfirmation",
      },
    });

    if (error) {
      setAlert("Error: " + error.message);
    } else {
      setAlert("Please check your inbox for email verification!");
    }
    setLoading(false);
    setPassword("");
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dynamicTheme(settings, "primary", 35) },
      ]}
    >
      <Text style={[styles.title, { color: dynamicTheme(settings, "text") }]}>
        Sign in
      </Text>
      <View style={styles.inputContainer}>
        <View>
          <Text
            style={[styles.text, { color: dynamicTheme(settings, "text") }]}
          >
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: dynamicTheme(settings, "primary"),
                backgroundColor: dynamicTheme(settings, "background", 40),
                color: dynamicTheme(settings, "text"),
              },
            ]}
            autoComplete="email"
            inputMode="email"
            onChangeText={setEmail}
            value={email}
            placeholderTextColor={"gray"}
            accessibilityLabel="email"
          />
        </View>
        <View>
          <Text
            style={[styles.text, { color: dynamicTheme(settings, "text") }]}
          >
            Password
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: dynamicTheme(settings, "primary"),
                backgroundColor: dynamicTheme(settings, "background", 40),
                color: dynamicTheme(settings, "text"),
              },
            ]}
            autoComplete="password"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            placeholderTextColor={"gray"}
            accessibilityLabel="password"
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
              <Text
                style={[
                  styles.signUpText,
                  { color: dynamicTheme(settings, "text", 80) },
                ]}
              >
                New account?
              </Text>
              <Button
                text="Sign Up"
                onPress={signUpWithEmail}
                color={dynamicTheme(settings, "accent", 75)}
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
    marginHorizontal: "auto",
    padding: 5,
  },
  title: {
    fontSize: 25,
    fontFamily: "Inter-Medium",
    marginBottom: 30,
    marginTop: 10,
    marginHorizontal: "auto",
  },
  text: {
    fontSize: 20,
    fontFamily: "Inter-Medium",
  },
  input: {
    borderWidth: 2,
    borderRadius: 9,
    fontSize: 17,
    fontFamily: "Inter-Regular",
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
    fontFamily: "Inter-Medium",
  },
});
