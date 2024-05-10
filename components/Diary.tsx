import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getCurrentDate } from "../utils/functions";
import { FlashList } from "@shopify/flash-list";
import { Note } from "./Note";
import { Stack, useNavigation } from "expo-router";
import { useEffect } from "react";

const noteExample = [{ date: getCurrentDate(), mood: 3, text: "text here" }];

export function Diary() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Diary</Text>
      <Stack>
        <Stack.Screen name="e" />
        {/* <Stack.Screen /> */}
      </Stack>
      <View style={{ width: "100%" }}>
        <FlashList
          data={noteExample}
          renderItem={({ item }) => {
            return <Note data={item} />;
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
  text: {
    color: "white",
    fontSize: 20,
  },
  newEntry: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 30,
    width: 60,
    height: 60,
    // display: "flex",
    position: "absolute",
    bottom: 10,
    backgroundColor: "pink",
  },
  plus: {
    margin: "auto",
  },
});
