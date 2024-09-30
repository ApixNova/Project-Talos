import { View, Text, StyleSheet, Pressable } from "react-native";
import { palette } from "../../utils/palette";
import { CalendarList, DateData } from "react-native-calendars";
import { useState } from "react";
import { getCurrentDate, serializeNote } from "../../utils/functions";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import Note from "../../model/Note";
import { Direction, MarkedDates } from "react-native-calendars/src/types";
import { NewNoteCalendarProp, SerializedNote } from "../../types";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Arrow from "../Arrow";
import getDaysOfMonth from "../../utils/month-functions";
import { database } from "../../utils/watermelon";
import { Q } from "@nozbe/watermelondb";
import { editNote } from "../../state/noteSlice";
import Button from "../Button";

export default function NewNoteCalendar({ props }: NewNoteCalendarProp) {
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());
  const notes = useAppSelector((state) => state.notes as SerializedNote[]);
  const dispatch = useAppDispatch();
  const { setNewNoteMenu } = props;

  const markedRef: MarkedDates = {
    [selectedDay]: {
      selected: true,
      selectedColor: palette.primary,
    },
  };

  for (const item in notes) {
    const note = notes[item] as SerializedNote;
    markedRef[note.day] = {
      ...markedRef[note.day],
      marked: true,
      dotColor: palette.background,
      activeOpacity: 0.8,
    };
  }

  function handleMonthChange(date: DateData) {
    const notesCopy = [...notes];
    let reduxUpdated = false;
    // load all days of the three months. And load the notes if they aren't already
    const allDays = getDaysOfMonth(date);

    async function loadNote(day: string) {
      const existingNote = await database
        .get<Note>("notes")
        .query(Q.where("day", day));
      if (existingNote.length > 0) {
        notesCopy.push(serializeNote(existingNote[0]));
        if (!reduxUpdated) reduxUpdated = true;
      }
    }
    const promises = allDays.map((day) => {
      // if the day isn't in Redux
      if (!notes.find((note) => note.day == day)) {
        //load note if it's in the DB
        return loadNote(day);
      }
    });
    Promise.all(promises).then(() => {
      if (reduxUpdated) {
        console.log("DISPATCHING".toLowerCase());
        dispatch(editNote(notesCopy));
      }
    });
  }

  function buttonText() {
    const noteExists = notes.find((note) => note.day == selectedDay);
    return noteExists ? "Edit note" : "New note";
  }

  function createOrEditNote() {
    const noteExists = notes.find((note) => note.day == selectedDay);
    if (noteExists) {
      router.navigate("/Diary/" + noteExists.id);
    } else {
      router.navigate("/Diary/" + selectedDay);
    }
  }

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            setNewNoteMenu(false);
          }}
        >
          <FontAwesome
            style={styles.close}
            name="close"
            size={24}
            color="white"
          />
        </Pressable>
        <Text style={styles.text}>Create or edit Diary entries</Text>
        <LinearGradient
          colors={[
            "rgba(124, 126, 192, 1)",
            palette.accent,
            palette.accent,
            palette.accent,
            // palette.accent,
            // palette.accent,
            // palette.accent,
            "rgba(124, 126, 192, 1)",
          ]}
          style={styles.calendarContainer}
        >
          <CalendarList
            markedDates={markedRef}
            onDayPress={(day: DateData) => setSelectedDay(day.dateString)}
            onMonthChange={(date) => handleMonthChange(date)}
            style={styles.calendar}
            theme={{
              calendarBackground: "transparent",
              textSectionTitleColor: palette.background,
              textMonthFontFamily: "Inter_400Regular",
              monthTextColor: palette.text,
              textMonthFontSize: 20,
              textDayHeaderFontFamily: "Inter_400Regular",
              textDayHeaderFontSize: 15,
              textDayFontFamily: "Inter_400Regular",
              //   textDayFontSize: 20,
              textDayStyle: {
                color: palette.text,
              },
              textDisabledColor: palette.gray,
              todayTextColor: palette.background,
            }}
            firstDay={1}
            hideArrows={false}
            calendarWidth={290}
            calendarHeight={290}
            pagingEnabled={true}
            hideExtraDays={false}
            renderArrow={(direction: Direction) => (
              <Arrow direction={direction} />
            )}
          />
        </LinearGradient>
        <Button
          text={buttonText()}
          onPress={createOrEditNote}
          style={{ borderColor: palette.text, borderWidth: 2, margin: "auto" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "rgba(24, 36, 74, 0.6)",
  },
  container: {
    backgroundColor: palette.background,
    // padding: 7,
    borderWidth: 2,
    borderColor: palette.rose,
    // position: "absolute",
    // top: "20%",
    width: "85%",
    maxWidth: 470,
    margin: "auto",
    height: "70%",
  },
  close: {
    marginLeft: 10,
    marginTop: 7,
  },
  text: {
    color: palette.rose,
    marginHorizontal: "auto",
    marginBottom: 7,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  calendarContainer: {
    height: "70%",
    width: 290,
    marginHorizontal: "auto",
  },
  calendar: {
    borderWidth: 2,
    borderColor: palette.rose,
  },
});
