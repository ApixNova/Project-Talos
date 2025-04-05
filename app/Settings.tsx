import { View, Text, StyleSheet, Pressable } from "react-native";
import { dynamicTheme, getTheme } from "../utils/palette";
import { database } from "../utils/watermelon";
import Picker from "../components/Picker";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import Setting from "../model/Setting";
import { serializeSetting, setupSettings } from "../utils/functions";
import { editSetting } from "../state/settingSlice";
import Button from "../components/Button";
import AlertComponent from "../components/Alert";
import { editMood } from "../state/moodSlice";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { editNote } from "../state/noteSlice";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Screen() {
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState("");
  const [alertGiveChoice, setAlertGiveChoice] = useState(false);
  const [alertConfirm, setAlertConfirm] = useState<() => void>(() => {});
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const height = useSharedValue(0);
  const rotateZ = useSharedValue("0deg");
  const [dataToggle, setDataToggle] = useState(false);
  const toggle = useSharedValue(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  function getFirstDay() {
    const firstDay = settings.find((element) => element.type == "firstDay");
    return firstDay ? firstDay.value : "Monday";
  }

  //on load fetch settings and update Redux
  useEffect(() => {
    async function fetchSettings() {
      const settingsQuery = await database
        .get<Setting>("settings")
        .query()
        .fetch();
      if (!settingsQuery) {
        await setupSettings();
      }
      updateRedux();
    }
    fetchSettings();
  }, []);

  async function updateRedux() {
    const settingsQuery = await database
      .get<Setting>("settings")
      .query()
      .fetch();
    const serializedSettings = settingsQuery.map((setting) =>
      serializeSetting(setting)
    );
    dispatch(editSetting(serializedSettings));
  }

  // a function to update settings, first in the database then in redux
  async function updateSettings(type = "theme", value: string) {
    const settingsQuery = await database
      .get<Setting>("settings")
      .query()
      .fetch();
    const typeArray = settingsQuery.map((element) => element.type);
    const indexOfSetting = typeArray.findIndex((element) => element == type);
    const settingToUpdate = settingsQuery[indexOfSetting];
    if (settingToUpdate.type == type && settingToUpdate.value != value) {
      //update
      await database.write(async () => {
        await settingToUpdate.update(() => {
          settingToUpdate.value = value;
        });
      });
    }
    // update redux
    updateRedux();
  }

  function resetPressed() {
    setMessage("Are you sure you want to delete all the local data?");
    setAlertConfirm(() => () => {
      resetDatabase();
    });
    setAlertGiveChoice(true);
    setShowAlert(true);
  }

  // a function to display a message, with no options to chose from
  function setAlert(message: string) {
    setMessage(message);
    setAlertGiveChoice(false);
    setAlertConfirm(() => () => {});
    setShowAlert(true);
  }

  function resetSupabasePressed() {
    setMessage(
      "Are you sure you want to permanently delete all your data?\n\nIf you only want to delete local data, please log out first :]"
    );
    setAlertGiveChoice(true);
    setAlertConfirm(() => () => {
      if (session && session.user) {
        resetSupabase();
      }
    });
    setShowAlert(true);
  }

  async function resetSupabase() {
    console.log("resetting supabase");
    try {
      const { error: errorFeelings } = await supabase
        .from("feelings")
        .delete()
        .eq("user_id", session?.user.id);
      const { error: errorNotes } = await supabase
        .from("notes")
        .delete()
        .eq("user_id", session?.user.id);
      await resetDatabase();
    } catch (error) {
      if (error instanceof Error) {
        setAlert(error.message);
      }
    }
  }

  async function resetDatabase() {
    console.log("resetting db");
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
    await setupSettings();
    //reload moods and notes
    dispatch(editMood({}));
    dispatch(editNote([]));
  }
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(40 * Number(dataToggle), { duration: 300 }),
    overflow: "hidden",
  }));
  const dataArrowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotateZ: withTiming(`${180 * Number(dataToggle) - 90}deg`, {
          duration: 300,
        }),
      },
    ],
  }));
  return (
    <View
      style={[
        styles.background,
        {
          backgroundColor: dynamicTheme(settings, "background"),
        },
      ]}
    >
      <AlertComponent
        message={message}
        visible={showAlert}
        setShowAlert={setShowAlert}
        giveChoice={alertGiveChoice}
        handleConfirm={alertConfirm}
        handleExit={() => {}}
      />
      <View
        style={[
          styles.container,
          // { backgroundColor: dynamicTheme(settings, "primary") },
        ]}
      >
        <View style={styles.settingRow}>
          <Text
            style={[styles.text, { color: dynamicTheme(settings, "text") }]}
          >
            Theme
          </Text>
          <Picker
            title={getTheme(settings)}
            options={["Dark", "Light", "Auto"]}
            state={getTheme(settings)}
            setState={(value) => updateSettings("theme", value)}
          />
        </View>
        <View
          style={[
            styles.separation,
            { backgroundColor: dynamicTheme(settings, "text") },
          ]}
        ></View>
        <View style={styles.settingRow}>
          <Text
            style={[styles.text, { color: dynamicTheme(settings, "text") }]}
          >
            First day of the week
          </Text>
          <Picker
            title={getFirstDay()}
            options={["Monday", "Sunday"]}
            state={getFirstDay()}
            setState={(value) => updateSettings("firstDay", value)}
          />
        </View>
        <View
          style={[
            styles.separation,
            { backgroundColor: dynamicTheme(settings, "text") },
          ]}
        ></View>
        <Pressable
          onPress={() => {
            setDataToggle((prev) => !prev);
          }}
        >
          <View style={styles.data}>
            <Text
              style={[styles.text, { color: dynamicTheme(settings, "text") }]}
            >
              Data
            </Text>
            <Animated.View
              style={[
                dataArrowStyle,
                {
                  marginLeft: 20,
                },
              ]}
            >
              <Ionicons
                style={[styles.dataToggle]}
                name="chevron-back-outline"
                size={25}
                color={dynamicTheme(settings, "text")}
              />
            </Animated.View>
          </View>
        </Pressable>
        <View style={{ margin: "auto" }}>
          {dataToggle && (
            <Animated.View style={animatedStyle}>
              {session && session.user ? (
                <Button
                  text="Delete local and online Data"
                  onPress={resetSupabasePressed}
                  color={dynamicTheme(settings, "accent", 75)}
                />
              ) : (
                <Button
                  text="Delete Data"
                  onPress={resetPressed}
                  color={dynamicTheme(settings, "accent", 75)}
                />
              )}
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    alignItems: "center",
    gap: 50,
    paddingTop: 20,
  },
  container: {
    maxWidth: 600,
    width: "90%",
    // margin: "auto",
    padding: 5,
    borderRadius: 7,
  },
  separation: {
    width: "90%",
    height: 1,
    marginHorizontal: "auto",
    marginVertical: 5,
  },
  data: {
    flexDirection: "row",
  },
  dataToggle: {
    marginLeft: "auto",
  },
  settingRow: {
    gap: 5,
  },
  text: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
  },
});
