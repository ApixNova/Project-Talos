import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import Setting from "../model/Setting";
import { useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";

export default function Button({
  text,
  onPress,
  color,
  style,
  disabled,
}: {
  text: string;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const settings = useAppSelector((state) => state.settings as Setting[]);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={text}
      style={[
        styles.button,
        { backgroundColor: color || dynamicTheme(settings, "secondary", 90) },
        style,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.buttonText,
          {
            // color: dynamicTheme(settings, "text"),
            color: "white",
          },
        ]}
      >
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
    fontFamily: "Inter-Regular",
    fontSize: 19,
    margin: "auto",
  },
});
