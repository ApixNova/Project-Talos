import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getCurrentDate } from "../utils/functions";
import { FlashList } from "@shopify/flash-list";
import { Note } from "./Note";
import { Stack, useNavigation } from "expo-router";
import { useEffect } from "react";
import { NotePreview } from "./NotePreview";
import { moodColor } from "../utils/palette";

const noteExample = [
  {
    id: "1",
    date: getCurrentDate(),
    mood: 3,
    title: "Title 1",
    content: "text here",
    createdAt: Date.now(),
  },
  {
    id: "2",
    date: getCurrentDate(),
    mood: 4,
    title: "Title 2",
    content: "text here",
    createdAt: Date.now(),
  },
];

export function Diary() {
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Take a note!</Text>
      <View style={styles.noteContainer}>
        <Note />
      </View>
      <View style={styles.noteList}>
        <FlashList
          data={noteExample}
          renderItem={({ item }) => {
            // return <Note data={item} />;
            return <NotePreview data={item} />;
          }}
          estimatedItemSize={200}
        />
      </View>
      <Pressable style={styles.newEntry}>
        <FontAwesome style={styles.plus} name="plus" size={30} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    // justifyContent: "center",
    alignItems: "center",
    flex: 1,
    // width: "100%",
  },
  mainTitle: {
    color: "white",
    fontSize: 20,
    marginVertical: 15,
  },
  noteContainer: {
    width: "98%",
    height: "50%",
  },
  noteList: {
    marginVertical: 10,
    width: "100%",
  },
  newEntry: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 30,
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 10,
    backgroundColor: "pink",
  },
  plus: {
    margin: "auto",
  },
});
