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
import { FontAwesome6 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
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
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Email</Text>
        <View style={styles.inputContainer}>
          <Foundation name="mail" size={37} color="white" />
          <TextInput
            style={styles.input}
            autoComplete="email"
            inputMode="email"
            onChangeText={setEmail}
            value={email}
            placeholder="email@address.com"
            placeholderTextColor={"gray"}
          />
        </View>
      </View>
      <View>
        <Text style={styles.text}>Password</Text>
        <View style={styles.inputContainer}>
          <FontAwesome6 name="lock" size={37} color="white" />
          <TextInput
            style={styles.input}
            autoComplete="password"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor={"gray"}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {!loading && (
          <Pressable style={styles.button} onPress={signInWithEmail}>
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>
        )}
        {!loading && (
          <Pressable style={styles.button} onPress={signUpWithEmail}>
            <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 900,
    borderWidth: 2,
    borderColor: "pink",
    borderRadius: 7,
    width: "90%",
    // margin: "auto",
    padding: 5,
  },
  text: {
    fontSize: 20,
    color: palette.text,
    marginHorizontal: "auto",
    fontFamily: "Inter_400Regular",
  },
  input: {
    color: palette.text,
    borderWidth: 2,
    borderColor: "pink",
    width: "90%",
    fontFamily: "Inter_400Regular",
    padding: 2,
    margin: 2,
  },
  inputContainer: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    // gap: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    padding: 5,
    borderWidth: 2,
    borderColor: "pink",
    borderRadius: 7,
    margin: "auto",
  },
  buttonText: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: 17,
  },
});
