import React, { useState } from "react";
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

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);

    setPassword("");
  }

  return (
    <View style={styles.container}>
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
              <Text style={styles.signUpText}>New account ?</Text>
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
