import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Setting from "../../model/Setting";
import { useAppSelector } from "../../state/hooks";
import { SaveMoodProps } from "../../types";
import { dynamicTheme } from "../../utils/palette";
import { updateMood } from "../../utils/updateMood";
import MoodPicker from "./MoodPicker";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect } from "react";

export default function SaveMood({ props }: SaveMoodProps) {
  const { moodPicker, setMoodPicker, setMoods, selectedDay } = props;
  const moods = useAppSelector((state) => state.moods.value);
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const height = useSharedValue(0);

  useEffect(() => {
    if (moodPicker) {
      height.value = withSpring(40);
    } else {
      height.value = withSpring(0);
    }
  }, [moodPicker]);

  function onPress() {
    setMoodPicker((prev) => !prev);
  }
  async function handlePress(moodType: number) {
    await updateMood(moodType, selectedDay);
    //update state
    let moodsList = JSON.parse(JSON.stringify(moods));
    moodsList[selectedDay] = moodType;
    setMoods(moodsList);
  }
  return (
    <>
      <View
        style={[
          styles.container,
          {
            borderColor: dynamicTheme(settings, "text"),
            backgroundColor: dynamicTheme(settings, "secondary"),
          },
        ]}
      >
        <Pressable onPress={onPress}>
          <Text
            style={[
              styles.buttonText,
              {
                color: dynamicTheme(settings, "background"),
              },
            ]}
          >
            Save Mood
          </Text>
        </Pressable>
      </View>
      {moodPicker && (
        <>
          <Animated.View
            style={[
              styles.container,
              {
                borderColor: dynamicTheme(settings, "text"),
                backgroundColor: dynamicTheme(settings, "secondary"),
                position: "absolute",
                bottom: height,
              },
            ]}
          >
            <Pressable
              onPress={() => {
                setMoodPicker(false);
              }}
            >
              <FontAwesome
                style={[
                  styles.close,
                  // { color: dynamicTheme(settings, "background") },
                ]}
                name="close"
                size={24}
                color="#0c0414"
              />
            </Pressable>
            <Text
              style={[
                styles.title,
                {
                  // color: dynamicTheme(settings, "background")
                  color: "#0c0414",
                },
              ]}
            >
              How was your day ?
            </Text>

            <MoodPicker handlePress={handlePress} />
          </Animated.View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    // borderColor: palette.text,
    borderWidth: 2,
    // backgroundColor: palette.secondary,
    padding: 15,
  },
  buttonText: {
    // color: palette.background,
    fontFamily: "Inter-Medium",
    fontSize: 16,
  },
  title: {
    textAlign: "center",
    // color: palette.background,
    fontFamily: "Inter-Medium",
    padding: 5,
    fontSize: 20,
  },
  close: {
    // textAlign: "center",
    // color: palette.background,
  },
});
