import { Pressable, StyleSheet, Text } from "react-native";
export default function Button({ props }) {
  const { moodPicker, setMoodPicker } = props;
  function onPress() {
    setMoodPicker((prev) => !prev);
  }
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Button</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "black",
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontFamily: "Georgia",
  },
});
