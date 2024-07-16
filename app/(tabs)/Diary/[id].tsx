import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { NoteComponent } from "../../../components/NoteComponent";
import { getCurrentDate } from "../../../utils/functions";

export default function Page() {
  const id = useLocalSearchParams().id as string;

  return (
    <View style={styles.container}>
      <View style={styles.noteContainer}>
        {id.match(/^\d{4}-\d{2}-\d{2}$/) ? (
          <NoteComponent props={{ editing: false, id: "", day: id }} />
        ) : (
          <NoteComponent props={{ editing: true, id, day: "" }} />
        )}
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
