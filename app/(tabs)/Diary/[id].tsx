import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Note } from "../../../components/Note";

export default function Page() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>Note id: {id}</Text>
      <View style={styles.noteContainer}>
        <Note />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "black",
    alignItems: "center",
  },
  noteContainer: {
    height: "95%",
    width: "100%",
  },
});
