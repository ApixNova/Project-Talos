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
import Animated, {
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function MoodOption({ props }: MoodOptionProps) {
  const { text, handlePress, style, type } = props;
  const { width } = useWindowDimensions();
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const size = useSharedValue(1);
  const opacity = useSharedValue(1);

  function triggerAnimation() {
    opacity.value = withSequence(
      withTiming(1, { duration: 0 }),
      withTiming(0, { duration: 600 })
    );
    size.value = withSequence(
      withTiming(1, { duration: 0 }),
      withTiming(1.5, { duration: 500 }),
      withTiming(1, { duration: 280 })
    );
  }

  const squareSize = (width * 0.5) / 4;

  function squareSizeLimited() {
    return squareSize < 70 ? squareSize : 70;
  }

  const sizeAnimated = useDerivedValue(() => {
    return squareSizeLimited() * size.value;
  });

  const borderRadiusAnimated = useDerivedValue(() => {
    return sizeAnimated.value / 2;
  });
  const positionAnimated = useDerivedValue(() => {
    return -(sizeAnimated.value - squareSizeLimited()) / 2;
  });
  return (
    <View style={styles.mood}>
      <View>
        <Pressable
          onPress={() => {
            handlePress(type);
            triggerAnimation();
          }}
          style={[
            style,
            styles.color,
            {
              width: squareSizeLimited(),
              height: squareSizeLimited(),
              borderRadius: squareSizeLimited() / 2,
              borderColor: "#0c0414",
              // zIndex: 0,
            },
          ]}
        ></Pressable>
        <Animated.View
          style={[
            styles.animation,
            style,
            {
              width: sizeAnimated,
              height: sizeAnimated,
              borderRadius: borderRadiusAnimated,
              // zIndex: -1,
              left: positionAnimated,
              top: positionAnimated,
              opacity: opacity,
            },
          ]}
        ></Animated.View>
      </View>
      <Text
        style={[
          styles.moodTitle,
          {
            // color: dynamicTheme(settings, "background")
            color: "#0c0414",
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
    margin: 1,
  },
  color: {
    borderWidth: 3,
    zIndex: 0,
  },
  moodTitle: {
    margin: 10,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  animation: {
    position: "absolute",
    zIndex: -1,
  },
  Top: {
    zIndex: 0,
  },
  Bottom: {
    zIndex: 1,
  },
});
