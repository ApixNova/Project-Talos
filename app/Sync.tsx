import { Pressable, View, Text } from "react-native";
import Auth from "../components/Auth";
import { mySync } from "../utils/sync";

export default function Screen() {
  return (
    <View>
      <Auth />
      <Pressable
        onPress={() => {
          mySync();
        }}
        style={{
          backgroundColor: "pink",
          padding: 5,
          borderRadius: 10,
        }}
      >
        <Text>Don't press me</Text>
      </Pressable>
    </View>
  );
}
