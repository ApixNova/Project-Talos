import { FontAwesome } from "@expo/vector-icons";
import { Q } from "@nozbe/watermelondb";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Direction, MarkedDates } from "react-native-calendars/src/types";
import Note from "../../model/Note";
import Setting from "../../model/Setting";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { editNote } from "../../state/noteSlice";
import { NewNoteCalendarProp, SerializedNote } from "../../types";
import {
  getCurrentDate,
  returnDayNum,
  serializeNote,
} from "../../utils/functions";
import getDaysOfMonth from "../../utils/month-functions";
import { dynamicTheme } from "../../utils/palette";
import { database } from "../../utils/watermelon";
import Arrow from "../Arrow";
import Button from "../Button";

export default function NewNoteCalendar({ props }: NewNoteCalendarProp) {
  const [selectedDay, setSelectedDay] = useState(getCurrentDate());
  const notes = useAppSelector((state) => state.notes as SerializedNote[]);
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const dispatch = useAppDispatch();
  const { setNewNoteMenu } = props;

  const markedRef: MarkedDates = {
    [selectedDay]: {
      selected: true,
      selectedColor: dynamicTheme(settings, "primary"),
    },
  };

  for (const item in notes) {
    const note = notes[item] as SerializedNote;
    markedRef[note.day] = {
      ...markedRef[note.day],
      marked: true,
      dotColor: dynamicTheme(settings, "background"),
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
      <View
        style={[
          styles.container,
          {
            backgroundColor: dynamicTheme(settings, "background"),
            borderColor: dynamicTheme(settings, "rose"),
          },
        ]}
      >
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
        <Text style={[styles.text, { color: dynamicTheme(settings, "rose") }]}>
          Create or edit diary entries
        </Text>
        <LinearGradient
          colors={[
            "rgba(124, 126, 192, 1)",
            dynamicTheme(settings, "secondary"),
            dynamicTheme(settings, "secondary"),
            dynamicTheme(settings, "secondary"),
            // dynamicTheme(settings, "secondary"),
            // dynamicTheme(settings, "secondary"),
            // dynamicTheme(settings, "secondary"),
            "rgba(124, 126, 192, 1)",
          ]}
          style={styles.calendarContainer}
        >
          <Calendar
            markedDates={markedRef}
            onDayPress={(day: DateData) => setSelectedDay(day.dateString)}
            onMonthChange={(date: DateData) => handleMonthChange(date)}
            style={[
              styles.calendar,
              {
                borderColor: dynamicTheme(settings, "rose"),
              },
            ]}
            theme={{
              calendarBackground: "transparent",
              textSectionTitleColor: dynamicTheme(settings, "background"),
              textMonthFontFamily: "Inter-Regular",
              monthTextColor: dynamicTheme(settings, "text"),
              textMonthFontSize: 20,
              textDayHeaderFontFamily: "Inter-Regular",
              textDayHeaderFontSize: 15,
              textDayFontFamily: "Inter-Regular",
              //   textDayFontSize: 20,
              textDayStyle: {
                color: dynamicTheme(settings, "text"),
              },
              textDisabledColor: dynamicTheme(settings, "gray"),
              todayTextColor: dynamicTheme(settings, "background"),
            }}
            firstDay={returnDayNum(settings)}
            hideArrows={false}
            calendarWidth={290}
            calendarHeight={290}
            pagingEnabled={true}
            hideExtraDays={false}
            renderArrow={(direction: Direction) => (
              <Arrow direction={direction} />
            )}
            enableSwipeMonths={true}
          />
        </LinearGradient>
        <Button
          text={buttonText()}
          onPress={createOrEditNote}
          style={{
            borderColor: dynamicTheme(settings, "text"),
            borderWidth: 2,
            margin: "auto",
          }}
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
    // backgroundColor: palette.background,
    // padding: 7,
    borderWidth: 2,
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
    // color: palette.rose,
    marginHorizontal: "auto",
    marginBottom: 7,
    fontFamily: "Inter-Regular",
    fontSize: 20,
  },
  calendarContainer: {
    // height: "70%",
    width: 290,
    marginHorizontal: "auto",
  },
  calendar: {
    borderWidth: 2,
    // borderColor: palette.rose,
  },
});
