import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { MoodOptionProps } from "../../types";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { dynamicTheme } from "../../utils/palette";
import { useAppSelector } from "../../state/hooks";
import Setting from "../../model/Setting";

export function MoodOption({ props }: MoodOptionProps) {
  const { text, handlePress, style, type, disable, setMoodUpdating } = props;
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const size = useSharedValue(1);
  const opacity = useSharedValue(1);
  const { width } = useWindowDimensions();

  function triggerAnimation() {
    size.value = withSequence(
      withTiming(1, { duration: 0 }),
      withTiming(1.5, { duration: 500 }),
      withTiming(1, { duration: 280 })
    );
    opacity.value = withSequence(
      withTiming(0, { duration: 1 }),
      withTiming(1, { duration: 0 }),
      withTiming(0, { duration: 600 })
    );
  }

  const sizeAnimated = useDerivedValue(() => {
    return moodSize() * size.value;
  });

  const borderRadiusAnimated = useDerivedValue(() => {
    return sizeAnimated.value / 2;
  });
  const positionAnimated = useDerivedValue(() => {
    return -(sizeAnimated.value - moodSize()) / 2;
  });

  function moodSize() {
    return width > 700 ? 60 : width > 400 ? 55 : 50;
  }

  return (
    <View style={styles.mood}>
      <Pressable
        disabled={disable}
        accessibilityLabel={text}
        onPress={() => {
          setMoodUpdating(true);
          triggerAnimation();
          (async () => {
            await handlePress(type);
            setMoodUpdating(false);
          })();
        }}
        style={[
          style,
          styles.color,
          {
            width: moodSize(),
            aspectRatio: 1,
            borderRadius: 9999,
            borderColor: "black",
          },
        ]}
      ></Pressable>
      <Animated.View
        style={[
          style,
          styles.animation,
          {
            width: sizeAnimated,
            height: sizeAnimated,
            borderRadius: borderRadiusAnimated,
            left: positionAnimated,
            top: positionAnimated,
            opacity: opacity,
          },
        ]}
      ></Animated.View>
      <Text
        style={[
          styles.moodTitle,
          {
            color: dynamicTheme(settings, "text"),
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mood: {
    marginVertical: 1,
    marginHorizontal: "auto",
    flex: 1,
  },
  color: {
    borderWidth: 2,
    zIndex: 0,
  },
  moodTitle: {
    marginVertical: 10,
    fontSize: 17,
    marginHorizontal: "auto",
    textAlign: "center",
    fontFamily: "Inter-Regular",
    color: "#0c0414",
  },
  animation: {
    position: "absolute",
    zIndex: -1,
  },
});
