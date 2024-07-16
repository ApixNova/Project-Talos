import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Direction } from "react-native-calendars/src/types";
import { palette } from "../utils/palette";

export default function Arrow({ direction }: { direction: Direction }) {
  //   console.log(direction);
  return direction == "right" ? (
    <AntDesign name="arrowdown" size={24} color={palette.text} />
  ) : (
    <AntDesign name="arrowup" size={24} color={palette.text} />
  );
}
