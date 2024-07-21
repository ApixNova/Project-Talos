import {
  Pressable,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Auth from "../components/Auth";
import { palette } from "../utils/palette";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { syncDatabase } from "../utils/sync";

export default function Screen() {
  const [session, setSession] = useState<Session | null>(null);
  const { height } = useWindowDimensions();

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
      {session && session.user ? (
        <View style={styles.logged}>
          <Text style={styles.text}>User Connected!</Text>
          <Text style={styles.text}>{session.user.email}</Text>
          <Pressable style={styles.button} onPress={signOut}>
            <Text style={styles.text}>Log out</Text>
          </Pressable>
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
        </View>
      ) : (
        <View
          style={[
            styles.auth,
            {
              marginTop: height / 5,
            },
          ]}
        >
          <Auth />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    height: "100%",
    // justifyContent: "space-around",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontFamily: "Inter_400Regular",
  },
  logged: {
    width: "50%",
    height: "50%",
  },
  auth: {
    // marginTop: "10%",
    height: "50%",
    width: "100%",
    // backgroundColor: "pink",
  },
  button: { backgroundColor: palette.rose, padding: 2 },
});
