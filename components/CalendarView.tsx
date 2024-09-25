import { View, StyleSheet, useWindowDimensions, Text } from "react-native";
import { CalendarList, Calendar, DateData } from "react-native-calendars";
import { useMemo } from "react";
import { calendarProps } from "../types";
import { palette } from "../utils/palette";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { MarkedDates } from "react-native-calendars/src/types";
import { getCurrentDate, returnColor } from "../utils/functions";
import Setting from "../model/Setting";
import { database } from "../utils/watermelon";
import { Q } from "@nozbe/watermelondb";
import Feeling from "../model/Feeling";
import { editMood } from "../state/moodSlice";

export default function CalendarView({ props }: calendarProps) {
  const { selectedDay, setSelectedDay } = props;
  const moods = useAppSelector((state) => state.moods.value);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings as Setting[]);
  const { width } = useWindowDimensions();

  function sizeWithLimits() {
    return width * 0.9 < 1060 ? width * 0.9 : 1060;
  }

  function returnDayNum() {
    return settings.find((element) => element.type == "firstDay")?.value ==
      "Sunday"
      ? 0
      : 1;
  }

  function onMonthChange(date: DateData) {
    let moodsList = structuredClone(moods);
    let reduxUpdated = false;

    function getNumDay(year: number, month: number) {
      return new Date(year, month, 0).getDate();
    }

    function twoDigitNum(num: number) {
      return JSON.stringify(num).length < 2 ? "0" + num : num;
    }

    function getDatesOfMonth(year: number, month: number) {
      let days = [];
      for (let day = 1; day <= getNumDay(year, month); day++) {
        days.push(year + "-" + twoDigitNum(month) + "-" + twoDigitNum(day));
      }
      return days;
    }
    // get all days of the current month
    const current = getDatesOfMonth(date.year, date.month);
    // get all days of the next month
    const next =
      date.month < 12
        ? getDatesOfMonth(date.year, date.month + 1)
        : getDatesOfMonth(date.year + 1, 1);
    // get all days of the previous month
    const previous =
      date.month > 1
        ? getDatesOfMonth(date.year, date.month - 1)
        : getDatesOfMonth(date.year - 1, 12);

    // now query required days from the DB and add them to redux
    const allDays = previous.concat(current).concat(next);

    async function loadFeelings(day: string) {
      const existingMood = await database
        .get<Feeling>("feelings")
        .query(Q.where("day", day));
      if (existingMood.length > 0) {
        moodsList[day] = existingMood[0].type;
        if (!reduxUpdated) reduxUpdated = true;
      }
    }
    const promises = allDays.map((day) => {
      // if the day isn't in Redux and is in the DB
      if (!moods[day]) {
        //get mood if it's in the DB
        // load it in Redux
        return loadFeelings(day);
      }
    });
    Promise.all(promises).then(() => {
      if (reduxUpdated) {
        console.log("DISPATCHING".toLowerCase());
        dispatch(editMood(moodsList));
      }
    });
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
    for (const day in moods) {
      markedRef[day] = {
        selected: true,
        selectedColor: returnColor(JSON.stringify(moods[day])),
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
    return markedRef;
  }, [selectedDay, moods]);
  return (
    <View style={styles.container}>
      <CalendarList
        onDayPress={(day) => handleDayPress(day)}
        onMonthChange={(date) => onMonthChange(date)}
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
        firstDay={returnDayNum()}
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
