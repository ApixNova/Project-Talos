import { useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Direction, MarkedDates } from "react-native-calendars/src/types";
import Setting from "../model/Setting";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { calendarProps } from "../types";
import { getCurrentDate, returnColor, returnDayNum } from "../utils/functions";
import { onMonthChange } from "../utils/month-functions";
import { dynamicTheme } from "../utils/palette";
import Arrow from "./Arrow";

export default function CalendarView({ props }: calendarProps) {
  const { selectedDay, setSelectedDay, open } = props;
  const moods = useAppSelector((state) => state.moods.value);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const { width } = useWindowDimensions();

  function sizeWithLimits() {
    return width * 0.9 < 1060 ? width * 0.9 : 1060;
  }

  function handleDayPress(day: DateData) {
    setSelectedDay(day.dateString);
    open.value = true;
  }
  const markedDates = useMemo(() => {
    const markedRef: MarkedDates = {
      [selectedDay]: {
        selected: true,
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: "inherit",
            borderColor: dynamicTheme(settings, "background"),
          },
          text: {
            color: "pink",
            fontFamily: "Inter-Regular",
          },
        },
      },
    };
    for (const day in moods) {
      markedRef[day] = {
        selected: true,
        selectedColor: returnColor(JSON.stringify(moods[day])),
        customStyles: {
          container: {
            borderColor: day == selectedDay ? "#adcadb" : "transparent",
            borderRadius: 0,
            width: "100%",
            // height: "100%",
          },
          text: {
            color: day == getCurrentDate() ? "#f57a7a" : "white",
          },
        },
      };
    }
    return markedRef;
  }, [selectedDay, moods]);
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: dynamicTheme(settings, "text"),
          // calendar background color
          backgroundColor: "#8f97ea",
        },
      ]}
    >
      <Calendar
        onDayPress={(day: DateData) => handleDayPress(day)}
        onMonthChange={(date: DateData) =>
          onMonthChange({ date, moods, dispatch })
        }
        markingType={"custom"}
        markedDates={markedDates}
        theme={{
          backgroundColor: "black",
          todayTextColor: "black",
          calendarBackground: "transparent",
          textSectionTitleColor: "black",
          textMonthFontFamily: "Inter-Regular",
          monthTextColor: dynamicTheme(settings, "text"),
          textMonthFontSize: 20,
          textDayHeaderFontFamily: "Inter-Regular",
          textDayHeaderFontSize: 14,
          textDayFontFamily: "Inter-Light",
          textDayFontSize: 20,
          textDayStyle: {
            color: dynamicTheme(settings, "text"),
          },
          textDisabledColor: dynamicTheme(settings, "gray"),
          // @ts-ignore: types / theme handling bug
          "stylesheet.day.basic": {
            base: {
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            },
          },
        }}
        firstDay={returnDayNum(settings)}
        style={[styles.calendar, { width: sizeWithLimits() }]}
        calendarWidth={sizeWithLimits()}
        // hideArrows={false}
        hideExtraDays={false}
        disableMonthChange={false}
        enableSwipeMonths={true}
        renderArrow={(direction: Direction) => <Arrow direction={direction} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // borderWidth: 2,
    borderRadius: 7,
    // padding: 10,
    // justifyContent: "center",
    marginTop: 100,
  },
  calendar: {
    // borderRadius: 20,
    // height: 300,
    margin: "auto",
  },
});
