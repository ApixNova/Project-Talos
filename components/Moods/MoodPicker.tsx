import { StyleSheet, View } from "react-native";
import { MoodPickerProps } from "../../types";
import { moodColor } from "../../utils/palette";
import { MoodOption } from "./MoodOption";

export default function MoodPicker({ handlePress }: MoodPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.selection}>
        <MoodOption
          props={{
            text: "abyss",
            handlePress,
            type: 0,
            style: styles.black,
          }}
        />
        <MoodOption
          props={{
            text: "bad",
            handlePress,
            type: 1,
            style: styles.red,
          }}
        />
        <MoodOption
          props={{
            text: "good",
            handlePress,
            type: 2,
            style: styles.blue,
          }}
        />
        <MoodOption
          props={{
            text: "great",
            handlePress,
            type: 3,
            style: styles.green,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  selection: {
    flexDirection: "row",
    gap: 4,
  },
  black: {
    backgroundColor: moodColor.black,
  },
  red: {
    backgroundColor: moodColor.red,
  },
  blue: {
    backgroundColor: moodColor.blue,
  },
  green: {
    backgroundColor: moodColor.green,
  },
});
