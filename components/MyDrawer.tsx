import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { View } from "react-native";
import { palette } from "../utils/palette";

export default function MyDrawer(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: palette.primary }}
    >
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
