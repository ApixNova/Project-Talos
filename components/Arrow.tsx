import { AntDesign } from "@expo/vector-icons";
import { Direction } from "react-native-calendars/src/types";
import Setting from "../model/Setting";
import { useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";

export default function Arrow({ direction }: { direction: Direction }) {
  const settings = useAppSelector((state) => state.settings as Setting[]);
  return direction == "right" ? (
    <AntDesign
      name="arrowdown"
      size={24}
      color={dynamicTheme(settings, "text")}
    />
  ) : (
    <AntDesign
      name="arrowup"
      size={24}
      color={dynamicTheme(settings, "text")}
    />
  );
}
