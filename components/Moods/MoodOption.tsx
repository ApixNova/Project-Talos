import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Setting from "../../model/Setting";
import { useAppSelector } from "../../state/hooks";
import { MoodOptionProps } from "../../types";
import { dynamicTheme } from "../../utils/palette";

export function MoodOption({ props }: MoodOptionProps) {
  const { text, handlePress, style, type } = props;
  const { width } = useWindowDimensions();
  const settings = useAppSelector((state) => state.settings as Setting[]);

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
            borderColor: dynamicTheme(settings, "background"),
          },
        ]}
      ></Pressable>
      <Text
        style={[
          styles.moodTitle,
          { color: dynamicTheme(settings, "background") },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mood: {
    margin: 1,
  },
  color: {
    borderWidth: 3,
    // borderColor: palette.background,
  },
  moodTitle: {
    margin: 10,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    // color: palette.background,
  },
});
