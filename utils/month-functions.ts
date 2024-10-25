import { DateData } from "react-native-calendars";
import { database } from "./watermelon";
import Feeling from "../model/Feeling";
import { Q } from "@nozbe/watermelondb";
import { editMood } from "../state/moodSlice";
import { OnMonthChangeProps } from "../types";

export default function getDaysOfMonth(date: DateData) {
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
  return allDays;
}

// handles loading moods on month change
export function onMonthChange({ date, moods, dispatch }: OnMonthChangeProps) {
  let moodsList = structuredClone(moods);
  let reduxUpdated = false;
  const allDays = getDaysOfMonth(date);

  async function loadFeeling(day: string) {
    const existingMood = await database
      .get<Feeling>("feelings")
      .query(Q.where("day", day));
    if (existingMood.length > 0) {
      moodsList[day] = existingMood[0].type;
      if (!reduxUpdated) reduxUpdated = true;
    }
  }
  const promises = allDays.map((day) => {
    // if the day isn't in Redux
    if (moods[day] == undefined) {
      //load mood if it's in the DB
      return loadFeeling(day);
    }
  });
  Promise.all(promises).then(() => {
    if (reduxUpdated) {
      dispatch(editMood(moodsList));
    }
  });
}
