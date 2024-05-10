import { View, Text, StyleSheet } from "react-native";

export function Note() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          color: "white",
        }}
      >
        Editable Note
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    borderRadius: 10,
    padding: 3,
    borderColor: "pink",
    marginHorizontal: 6,
  },
});
