import { View, Text, StyleSheet, Pressable } from "react-native";
import { Moods, Note } from "../types";
import { Link, router } from "expo-router";
import { palette } from "../utils/palette";
import { returnColor } from "../utils/functions";
import { useAppSelector } from "../state/hooks";

export function NotePreview({ data }: { data: Note }) {
  const moods = useAppSelector((state) => state.moods.value as Moods);
  function handlePress() {
    router.navigate("/Diary/" + data.id);
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.date}>{data.day}</Text>
      <View
        style={[
          styles.mood,
          { backgroundColor: returnColor(JSON.stringify(moods[data.day])) },
        ]}
      ></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    borderRadius: 10,
    padding: 3,
    borderColor: "pink",
    marginVertical: 1,
    width: "98%",
    margin: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    color: palette.gray,
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    marginLeft: 13,
  },
  title: {
    fontFamily: "Inter_400Regular",
    color: palette.text,
    fontSize: 20,
    marginLeft: 5,
  },
  mood: {
    width: 20,
    height: 20,
    // backgroundColor: "red",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    marginLeft: "auto",
  },
});
