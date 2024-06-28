import React, { useState } from "react";
import { Alert, Pressable, TextInput, View, Text } from "react-native";
import { supabase } from "../utils/supabase";

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
    <View>
      <View>
        <TextInput />
      </View>
      <View>
        <TextInput />
      </View>
      <View>
        <Pressable>
          <Text>Sign in</Text>
        </Pressable>
      </View>
      <View>
        <Pressable>
          <Text>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}
