import { StyleSheet, View, Text, Pressable } from "react-native";
import { palette } from "../utils/palette";
import { syncDatabase } from "../utils/sync";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Session } from "@supabase/supabase-js";

export default function UserPage() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }
  return (
    <View style={styles.container}>
      {session && session.user && (
        <>
          <Text style={styles.title}>{session.user.email}</Text>
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
          <Pressable style={styles.button} onPress={signOut}>
            <Text style={styles.text}>Log out</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.accent,
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
    color: palette.background,
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
    // backgroundColor: "pink",
  },
  button: {
    backgroundColor: palette.rose,
    padding: 5,
    borderRadius: 7,
  },
});
