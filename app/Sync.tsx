import { Pressable, View, Text, StyleSheet } from "react-native";
import Auth from "../components/Auth";
import { palette } from "../utils/palette";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { syncDatabase } from "../utils/sync";

export default function Screen() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Auth />
      <Pressable
        onPress={() => {
          syncDatabase();
        }}
        style={{
          backgroundColor: "pink",
          padding: 5,
          borderRadius: 10,
        }}
      >
        <Text>Sync</Text>
      </Pressable>
      {session && session.user && (
        <>
          <Text style={styles.text}>User Connected!</Text>
          <Text style={styles.text}>{session.user.email}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontFamily: "Inter_400Regular",
  },
});
