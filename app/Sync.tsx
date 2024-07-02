import { Pressable, View, Text, StyleSheet } from "react-native";
import Auth from "../components/Auth";
import { mySync } from "../utils/sync";

export default function Screen() {
  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
    height: "100%",
  },
});
