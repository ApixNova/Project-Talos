import { View, StyleSheet, useWindowDimensions, Text } from "react-native";
import { CalendarList, Calendar, DateData } from "react-native-calendars";
import { useMemo } from "react";
import { calendarProps } from "../types";
import { moodColor, palette } from "../utils/palette";
import { useAppSelector } from "../state/hooks";
import { MarkedDates } from "react-native-calendars/src/types";
import Day from "react-native-calendars/src/calendar/day";
import { getCurrentDate } from "../utils/functions";

export default function CalendarView({ props }: calendarProps) {
  const { selectedDay, setSelectedDay } = props;
  const moods = useAppSelector((state) => state.moods.value);
  const { width } = useWindowDimensions();

  function sizeWithLimits() {
    return width * 0.9 < 1060 ? width * 0.9 : 1060;
  }

  function getColor(type: number) {
    switch (type) {
      case 0:
        return moodColor.black;
      case 1:
        return moodColor.red;
      case 2:
        return moodColor.blue;
      case 3:
        return moodColor.green;
      default:
        return moodColor.blue;
    }
  }

  function handleDayPress(day: DateData) {
    setSelectedDay(day.dateString);
  }
  const markedDates = useMemo(() => {
    const markedRef: MarkedDates = {
      [selectedDay]: {
        selected: true,
        disableTouchEvent: true,
        // selectedColor: "black",
        customStyles: {
          container: {
            backgroundColor: "inherit",
            borderColor: palette.background,
            borderWidth: 4,
            borderRadius: 0,
            width: "100%",
            height: "100%",
            // padding: 0,
          },
          text: {
            color: "pink",
            fontFamily: "Inter_400Regular",
          },
        },
      },
    };
    // console.log("moods");
    // console.log(moods);
    for (const day in moods) {
      markedRef[day] = {
        selected: true,
        selectedColor: getColor(moods[day]),
        customStyles: {
          container: {
            borderColor: day == selectedDay ? "#adcadb" : "transparent",
            borderWidth: 4,
            borderRadius: 0,
            width: "100%",
            height: "100%",
          },
          text: {
            color: day == getCurrentDate() ? "#f57a7a" : palette.text,
          },
        },
      };
    }
    // console.log("ref:");
    // console.log(markedRef);
    return markedRef;
  }, [selectedDay, moods]);
  return (
    <View style={styles.container}>
      <CalendarList
        onDayPress={(day) => handleDayPress(day)}
        markingType={"custom"}
        markedDates={markedDates}
        theme={{
          backgroundColor: "black",
          calendarBackground: "#7d7bb3",
          textSectionTitleColor: palette.background,
          textMonthFontFamily: "Inter_400Regular",
          monthTextColor: palette.text,
          textMonthFontSize: 20,
          textDayHeaderFontFamily: "Inter_400Regular",
          textDayHeaderFontSize: 15,
          textDayFontFamily: "Inter_300Light",
          textDayFontSize: 20,
          textDayStyle: {
            color: palette.text,
          },
          textDisabledColor: palette.accent,
          // @ts-ignore: types / theme handling bug
          "stylesheet.day.basic": {
            base: {
              width: "100%",
              height: "100%",
              // justifyContent: "center",
              alignItems: "center",
              borderWidth: 4,
              borderColor: "transparent",
            },
          },
          "stylesheet.calendar.main": {
            container: {
              // paddingLeft: 5,
              // paddingRight: 5,
            },
          },
        }}
        // horizontal={true}
        pagingEnabled={true}
        firstDay={1}
        style={[styles.calendar, { width: sizeWithLimits() }]}
        calendarWidth={sizeWithLimits()}
        // hideArrows={false}
        hideExtraDays={false}
        // showSixWeeks={true}
        disableMonthChange={false}
        // allowSelectionOutOfRange={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: palette.text,
    // borderRadius: 20,
    // padding: 10,
    // backgroundColor: "#a0c0eb",
    // justifyContent: "center",
    height: 370,
  },
  calendar: {
    // borderRadius: 20,
    // height: 300,
    margin: "auto",
  },
});
