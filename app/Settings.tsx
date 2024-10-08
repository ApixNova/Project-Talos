import { View, Text, StyleSheet } from "react-native";
import { dynamicTheme, getTheme } from "../utils/palette";
import { database } from "../utils/watermelon";
import Picker from "../components/Picker";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import Setting from "../model/Setting";
import {
  serializeSetting,
  setupSettings,
  toDateData,
} from "../utils/functions";
import { editSetting } from "../state/settingSlice";
import Button from "../components/Button";
import AlertComponent from "../components/Alert";
import { onMonthChange } from "../utils/month-functions";
import reloadNotes from "../utils/reload-notes";
import { editMood } from "../state/moodSlice";

export default function Screen() {
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const moods = useAppSelector((state) => state.moods.value);

  function getFirstDay() {
    const firstDay = settings.find((element) => element.type == "firstDay");
    return firstDay ? firstDay.value : "Monday";
  }

  //on load fetch settings and update Redux
  useEffect(() => {
    console.log("settings again");
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
    setShowAlert(true);
  }

  async function resetDatabase() {
    console.log("resetting db");
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
    await setupSettings();
    //reload moods and notes
    dispatch(editMood({}));
    onMonthChange({ date: toDateData(), moods, dispatch });
    reloadNotes({ dispatch });
  }
  return (
    <View
      style={[
        styles.background,
        {
          backgroundColor: dynamicTheme(settings, "background"),
          borderColor: dynamicTheme(settings, "text"),
        },
      ]}
    >
      <AlertComponent
        message={message}
        visible={showAlert}
        setShowAlert={setShowAlert}
        giveChoice
        handleConfirm={resetDatabase}
        handleExit={() => {}}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: dynamicTheme(settings, "accent") },
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
            { backgroundColor: dynamicTheme(settings, "primary") },
          ]}
        ></View>
        <View style={styles.settingRow}>
          <Text
            style={[styles.text, { color: dynamicTheme(settings, "text") }]}
          >
            First Day Of The Week
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
            { backgroundColor: dynamicTheme(settings, "primary") },
          ]}
        ></View>
        <Button
          text="Reset DB"
          onPress={resetPressed}
          color={dynamicTheme(settings, "secondary")}
          style={{ margin: "auto" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    // backgroundColor: palette.background,
    height: "100%",
    alignItems: "center",
    gap: 50,
    paddingTop: 20,
    borderWidth: 2,
    // borderColor: palette.text,
  },
  container: {
    maxWidth: 600,
    // backgroundColor: palette.accent,
    width: "90%",
    margin: "auto",
    padding: 5,
    borderRadius: 7,
  },
  separation: {
    width: "90%",
    height: 1,
    // backgroundColor: palette.primary,
    marginHorizontal: "auto",
    marginVertical: 5,
  },
  settingRow: {
    gap: 5,
  },
  text: {
    // color: palette.text,
    fontSize: 20,
    fontFamily: "Inter_400Regular",
  },
  // textSetting: {
  //   color: palette.accent,
  //   fontSize: 20,
  //   fontFamily: "Inter_400Regular",
  // },
});
