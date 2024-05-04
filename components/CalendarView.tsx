import { View, StyleSheet, useWindowDimensions } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import { useMemo } from "react";
import { calendarProps } from "../types";
import { moodColor } from "../utils/palette";
import { useAppSelector } from "../state/hooks";
import { MarkedDates } from "react-native-calendars/src/types";

export default function CalendarView({ props }: calendarProps) {
  const { selectedDay, setSelectedDay } = props;
  const moods = useAppSelector((state) => state.moods.value);
  const { width } = useWindowDimensions();

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
            borderColor: "#26186e",
            borderWidth: 4,
            borderRadius: 0,
            width: "100%",
            height: "100%",
          },
          text: {
            color: "black",
          },
        },
      },
    };
    console.log("moods");
    console.log(moods);
    for (const day in moods) {
      markedRef[day] = {
        selected: true,
        selectedColor: getColor(moods[day]),
        customStyles: {
          container: {
            borderColor: day == selectedDay ? "black" : "transparent",
            borderWidth: 4,
            borderRadius: 0,
            width: "100%",
            height: "100%",
          },
          text: {
            color: "white",
          },
        },
      };
    }
    console.log("ref:");
    console.log(markedRef);
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
          calendarBackground: "#a0c0eb",
          textSectionTitleColor: "black",
          textDayFontFamily: "Georgia",
          textMonthFontFamily: "Georgia",
          textDayHeaderFontFamily: "Georgia",
          textDayFontSize: 20,
          textDayHeaderFontSize: 15,
          textMonthFontSize: 20,
        }}
        horizontal={true}
        pagingEnabled={true}
        firstDay={1}
        style={[styles.calendar, { width: width * 0.9 }]}
        calendarWidth={width * 0.9}
        hideArrows={false}
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
    borderWidth: 5,
    // borderRadius: 20,
    // padding: 10,
    // backgroundColor: "#a0c0eb",
    // justifyContent: "center",
    height: 370,
    fontFamily: "Georgia",
  },
  calendar: {
    // borderRadius: 20,
    // height: 300,
    margin: "auto",
  },
});
