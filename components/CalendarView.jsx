import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Calendar, CalendarList } from "react-native-calendars";

export default function CalendarView({ props }) {
  const { selectedDay, setSelectedDay } = props;
  const { height, width } = useWindowDimensions();

  function handleDayPress(day) {
    setSelectedDay(day.dateString);
  }

  return (
    <View style={styles.container}>
      <CalendarList
        onDayPress={(day) => handleDayPress(day)}
        markedDates={{
          [selectedDay]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: "black",
          },
        }}
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
