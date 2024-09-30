import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { palette } from "../utils/palette";

export default function Button({
  text,
  onPress,
  color,
  style,
}: {
  text: string;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: color || palette.primary },
        style,
      ]}
    >
      <Text numberOfLines={1} style={styles.buttonText}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 7,
  },
  buttonText: {
    color: palette.text,
    fontFamily: "Inter_400Regular",
    fontSize: 17,
    margin: "auto",
  },
});
