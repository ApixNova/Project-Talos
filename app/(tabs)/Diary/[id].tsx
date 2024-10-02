import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { NoteComponent } from "../../../components/Diary/NoteComponent";
import { dynamicTheme } from "../../../utils/palette";
import { useAppSelector } from "../../../state/hooks";
import Setting from "../../../model/Setting";

export default function Page() {
  const id = useLocalSearchParams().id as string;
  const settings = useAppSelector((state) => state.settings as Setting[]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dynamicTheme(settings, "black") },
      ]}
    >
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
    // backgroundColor: palette.black,
    alignItems: "center",
  },
  noteContainer: {
    height: "95%",
    width: "100%",
  },
});
