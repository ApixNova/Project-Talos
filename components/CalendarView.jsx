import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Calendar, CalendarList } from "react-native-calendars";


export default function CalendarView({ props }) {
  const { selectedDay, setSelectedDay } = props;
  const {height, width} = useWindowDimensions()

  return (
    <View style={styles.container}>
      <CalendarList
        onDayPress={(day) => {
          setSelectedDay(day.dateString);
        }}
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
          textSectionTitleColor: 'black',
        }}
        horizontal={true}
        pagingEnabled={true}
        firstDay={1}
        style={[styles.calendar, {width: width * 0.9}]}
        calendarWidth={width * 0.9}
        hideArrows={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 5,
    borderRadius: 50,
    padding: 0,
    backgroundColor: "#a0c0eb",
    // width: "90%",
    height: "50%",
    justifyContent: 'center'

  },
  calendar: {
    borderRadius: 50,
    alignSelf: 'center'
  }
});
