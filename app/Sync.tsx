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
import UserPage from "../components/UserPage";

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

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: height / 5,
          width: "100%",
        }}
      >
        {session && session.user ? (
          <UserPage />
        ) : (
          <View style={styles.auth}>
            <Auth />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    height: "100%",
    alignItems: "center",
  },
  auth: {
    height: "50%",
    width: "100%",
  },
});
