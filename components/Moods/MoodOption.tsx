import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { MoodOptionProps } from "../../types";
import { palette } from "../../utils/palette";

export function MoodOption({ props }: MoodOptionProps) {
  const { text, handlePress, style, type } = props;

  const { width } = useWindowDimensions();

  const squareSize = (width * 0.5) / 4;

  function squareSizeLimited() {
    return squareSize < 70 ? squareSize : 70;
  }

  return (
    <View style={styles.mood}>
      <Pressable
        onPress={() => {
          handlePress(type);
        }}
        style={[
          style,
          styles.color,
          {
            width: squareSizeLimited(),
            height: squareSizeLimited(),
            borderRadius: squareSizeLimited() / 2,
          },
        ]}
      ></Pressable>
      <Text style={styles.moodTitle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mood: {
    margin: 1,
  },
  color: {
    borderWidth: 3,
    borderColor: palette.background,
  },
  moodTitle: {
    margin: 10,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    color: palette.background,
  },
});
