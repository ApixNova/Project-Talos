import { Direction } from "react-native-calendars/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Arrow({ direction }: { direction: Direction }) {
  return direction == "right" ? (
    <Ionicons
      name="chevron-back-outline"
      size={27}
      color="white"
      style={{ transform: [{ rotateZ: "180deg" }] }}
    />
  ) : (
    <Ionicons name="chevron-back-outline" size={27} color="white" />
  );
}
