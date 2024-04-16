import { View, StyleSheet, useWindowDimensions } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useMemo, useState } from "react";
import { calendarProps } from "../types";

// const enhance = withObservables(["moods"], ({ moods }) => ({
//   moods,
// }));

export default function CalendarView({ props }: calendarProps) {
  const { selectedDay, setSelectedDay, moods } = props;
  const { height, width } = useWindowDimensions();
  // const [markedDates, setMarkedDates] = useState({
  //   [selectedDay]: {
  //     selected: true,
  //     disableTouchEvent: true,
  //     selectedColor: "black",
  //   },
  // });

  function getColor(type: number) {
    switch (type) {
      case 0:
        return "black";
      case 1:
        return "red";
      case 2:
        return "blue";
      case 3:
        return "green";
      default:
        return "blue";
    }
  }

  useEffect(() => {
    // moods.map(
    //   (mood) =>
    //     (markedDates[mood.day] = {
    //       selected: true,
    //       disableTouchEvent: true,
    //       selectedColor: getColor(mood.type),
    //     })
    // );
    // console.log(markedDates);
  }, [moods]);

  function handleDayPress(day: DateData) {
    setSelectedDay(day.dateString);
  }
  //DEBUG
  // console.log(markedDates);
  const markedDates = useMemo(() => {
    const markedRef: any = {
      [selectedDay]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: "black",
      },
    };
    console.log("moods");
    console.log(moods);
    moods.map(
      (mood) =>
        (markedRef[mood[0]] = {
          selected: true,
          disableTouchEvent: true,
          selectedColor: getColor(mood[1]),
        })
    );
    console.log("ref:");
    console.log(markedRef);
    return markedRef;
  }, [selectedDay, moods]);
  //DEBUG END
  return (
    <View style={styles.container}>
      <CalendarList
        onDayPress={(day) => handleDayPress(day)}
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
