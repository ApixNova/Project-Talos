import { View, Text, StyleSheet, Pressable } from "react-native";
import { palette } from "../utils/palette";
import { database } from "../utils/watermelon";
import Picker from "../components/Picker";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import Setting from "../model/Setting";
import { serializeSetting, setupSettings } from "../utils/functions";
import { editSetting } from "../state/settingSlice";

export default function Screen() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings as Setting[]);

  function getTheme() {
    const theme = settings.find((element) => element.type == "theme");
    return theme ? theme.value : "Dark";
  }

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

  function resetDatabase() {
    console.log("resetting db");
    database.write(async () => {
      database.unsafeResetDatabase();
    });
  }
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={resetDatabase}>
        <Text style={styles.text}>Reset DB</Text>
      </Pressable>
      <View style={styles.settingRow}>
        <Text style={styles.text}>Theme: </Text>
        <Picker
          title={getTheme()}
          options={["Dark", "Light", "Auto"]}
          state={getTheme()}
          setState={(value) => updateSettings("theme", value)}
        />
        <Text>{getTheme()}</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.text}>First Day Of The Week: </Text>
        <Picker
          title={getFirstDay()}
          options={["Monday", "Sunday"]}
          state={getFirstDay()}
          setState={(value) => updateSettings("firstDay", value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    height: "100%",
    alignItems: "center",
    gap: 50,
    paddingTop: 20,
    borderWidth: 2,
    borderColor: palette.text,
  },
  title: {
    color: "white",
    fontFamily: "Inter_900Black",
    fontSize: 30,
    marginHorizontal: "auto",
  },
  button: {
    backgroundColor: "white",
  },
  settingRow: {
    flexDirection: "row",
  },
  text: {
    color: palette.secondary,
    fontSize: 20,
    fontFamily: "Inter_400Regular",
  },
  textSetting: {
    color: palette.accent,
    fontSize: 20,
    fontFamily: "Inter_400Regular",
  },
});
