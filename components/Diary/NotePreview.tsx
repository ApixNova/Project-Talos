import { router } from "expo-router";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Setting from "../../model/Setting";
import { useAppSelector } from "../../state/hooks";
import { Moods, SerializedNote } from "../../types";
import { getWeekDay, returnColor } from "../../utils/functions";
import { dynamicTheme } from "../../utils/palette";

export function NotePreview({ data }: { data: SerializedNote }) {
  const moods = useAppSelector((state) => state.moods.value as Moods);
  const { width } = useWindowDimensions();
  const settings = useAppSelector((state) => state.settings as Setting[]);

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
          <Text
            style={[styles.title, { color: dynamicTheme(settings, "text") }]}
            numberOfLines={2}
          >
            {data.title}
          </Text>
          <Text
            style={[styles.date, { color: dynamicTheme(settings, "gray") }]}
          >
            {data.day}
          </Text>
        </>
      ) : (
        <>
          <Text
            style={[
              styles.dayOfWeek,
              { color: dynamicTheme(settings, "text") },
            ]}
          >
            {getWeekDay(new Date(data.day).getDay())}
          </Text>
          <Text
            style={[styles.date, { color: dynamicTheme(settings, "gray") }]}
          >
            {data.day}
          </Text>
        </>
      )}
      <View
        style={[
          styles.mood,
          {
            backgroundColor: returnColor(JSON.stringify(moods[data.day])),
            ...Platform.select({
              ios: {
                shadowColor: dynamicTheme(settings, "text"),
              },
              android: {
                shadowColor: dynamicTheme(settings, "text"),
              },
              web: {
                boxShadow: dynamicTheme(settings, "text") + " 0px 0px 4px",
              },
            }),
          },
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
    // color: palette.gray,
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    // marginLeft: 13,
    marginLeft: "auto",
    marginRight: 13,
    flexShrink: 0,
  },
  title: {
    fontFamily: "Inter_400Regular",
    // color: palette.text,
    fontSize: 20,
    marginLeft: 5,
  },
  dayOfWeek: {
    // color: palette.text,
    fontFamily: "Inter_300Light",
    fontSize: 20,
    marginLeft: 5,
  },
  mood: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 0,
    // shadow
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
