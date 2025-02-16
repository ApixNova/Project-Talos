import { StyleSheet, useWindowDimensions, View } from "react-native";
import { MoodPickerProps } from "../../types";
import { moodColor } from "../../utils/palette";
import { MoodOption } from "./MoodOption";
import { useState } from "react";

export default function MoodPicker({ handlePress }: MoodPickerProps) {
  const { width } = useWindowDimensions();
  const [moodUpdating, setMoodUpdating] = useState(false);
  return (
    <View>
      <View
        style={[
          styles.selection,
          {
            width: width / 1.4,
            maxWidth: 310,
          },
        ]}
      >
        <MoodOption
          props={{
            text: "abyss",
            handlePress,
            type: 0,
            style: styles.black,
            disable: moodUpdating,
            setMoodUpdating: setMoodUpdating,
          }}
        />
        <MoodOption
          props={{
            text: "bad",
            handlePress,
            type: 1,
            style: styles.red,
            disable: moodUpdating,
            setMoodUpdating: setMoodUpdating,
          }}
        />
        <MoodOption
          props={{
            text: "mid",
            handlePress,
            type: 4,
            style: styles.gray,
            disable: moodUpdating,
            setMoodUpdating: setMoodUpdating,
          }}
        />
        <MoodOption
          props={{
            text: "good",
            handlePress,
            type: 2,
            style: styles.blue,
            disable: moodUpdating,
            setMoodUpdating: setMoodUpdating,
          }}
        />
        <MoodOption
          props={{
            text: "great",
            handlePress,
            type: 3,
            style: styles.green,
            disable: moodUpdating,
            setMoodUpdating: setMoodUpdating,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selection: {
    flexDirection: "row",
    gap: 4,
    marginHorizontal: "auto",
  },
  black: {
    backgroundColor: moodColor.black,
  },
  red: {
    backgroundColor: moodColor.red,
  },
  gray: {
    backgroundColor: moodColor.gray,
  },
  blue: {
    backgroundColor: moodColor.blue,
  },
  green: {
    backgroundColor: moodColor.green,
  },
});
