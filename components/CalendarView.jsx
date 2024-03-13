import { View, StyleSheet } from "react-native";
import { Calendar, CalendarList } from "react-native-calendars";

export default function CalendarView({ props }) {
  const { selected, setSelected } = props;
  return (
    <View style={styles.container}>
      <CalendarList
        onDayPress={(day) => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: "black",
          },
        }}
        theme={{
          backgroundColor: "black",
          calendarBackground: "#a0c0eb",
        }}
        horizontal={true}
        pagingEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 5,
    borderRadius: 50,
    padding: 20,
    backgroundColor: "#a0c0eb",
    width: "90%",
    height: "50%",
  },
});
