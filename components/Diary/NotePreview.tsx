import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Moods, Note } from "../../types";
import { Link, router } from "expo-router";
import { palette } from "../../utils/palette";
import { getWeekDay, returnColor } from "../../utils/functions";
import { useAppSelector } from "../../state/hooks";
import { useEffect } from "react";

export function NotePreview({ data }: { data: Note }) {
  const moods = useAppSelector((state) => state.moods.value as Moods);
  const { width } = useWindowDimensions();

  // useEffect(() => {}, [width]);

  function handlePress() {
    router.navigate("/Diary/" + data.id);
  }

  return (
    <Pressable
      style={[
        styles.container,
        {
          width: width < 1200 ? "94%" : "75%",
        },
      ]}
      onPress={handlePress}
    >
      {data.title ? (
        <>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.date}>{data.day}</Text>
        </>
      ) : (
        <>
          <Text style={styles.dayOfWeek}>
            {getWeekDay(new Date(data.day).getDay())}
          </Text>
          <Text style={styles.date}>{data.day}</Text>
        </>
      )}
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
    margin: "auto",
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 1350,
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
  dayOfWeek: {
    color: palette.text,
    fontFamily: "Inter_300Light",
    fontSize: 20,
    marginLeft: 5,
  },
  mood: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: "auto",
    // shadow
    ...Platform.select({
      ios: {
        shadowColor: palette.text,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        shadowColor: palette.text,
        elevation: 5,
      },
      web: {
        boxShadow: palette.text + " 0px 0px 4px",
      },
    }),
  },
});
