import { View, Text, StyleSheet } from "react-native";

export default function Screen() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: "Inter_900Black",
          // fontSize: 40
        }}
      >
        Options
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    height: "100%",
  },
});
