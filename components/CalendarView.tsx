import { View, StyleSheet, useWindowDimensions } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useMemo, useState } from "react";
import { calendarProps } from "../types";
import { text } from "@nozbe/watermelondb/decorators";

// const enhance = withObservables(["moods"], ({ moods }) => ({
//   moods,
// }));

export default function CalendarView({ props }: calendarProps) {
  const { selectedDay, setSelectedDay, moods } = props;
  const { height, width } = useWindowDimensions();

  function getColor(type: number) {
    switch (type) {
      case 0:
        return "#0f0f0f";
      case 1:
        return "#ab2b40";
      case 2:
        return "#2f1f94";
      case 3:
        return "#3e9e5e";
      default:
        return "#2f1f94";
    }
  }

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
  //DEBUG END
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
