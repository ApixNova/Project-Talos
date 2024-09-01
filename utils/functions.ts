import { Q } from "@nozbe/watermelondb";
import Setting from "../model/Setting";
import { Note } from "../types";
import { moodColor } from "./palette";
import { database } from "./watermelon";

//returns current date in YYYY-MM-DD format taking into account the timezone
export function getCurrentDate() {
  const currentDate = new Date();
  const offset = currentDate.getTimezoneOffset();
  const shiftedDate = new Date(currentDate.getTime() - offset * 60 * 1000);
  return shiftedDate.toISOString().split("T")[0];
}

export function getWeekDay(day: number) {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "[error]";
  }
}
export function getMonth(month: number) {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "[error]";
  }
}

export function fullDate(date: string) {
  return (
    getWeekDay(new Date(date).getDay()) +
    " " +
    new Date(date).getDate() +
    " " +
    getMonth(new Date(date).getMonth()) +
    " " +
    new Date(date).getFullYear()
  );
}

export function returnColor(type: string) {
  switch (type) {
    case "0":
      return moodColor.black;
    case "1":
      return moodColor.red;
    case "2":
      return moodColor.blue;
    case "3":
      return moodColor.green;
    default:
      return "gray";
  }
}

export function serializeNote(note: Note) {
  return {
    id: note.id,
    day: note.day,
    title: note.title,
    content: note.content,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  };
}

export function serializeSetting(setting: Setting) {
  return {
    id: setting.id,
    type: setting.type,
    value: setting.value,
  };
}

export async function setupSettings() {
  const themeQuery = await database
    .get("settings")
    .query(Q.where("type", "theme"));
  if (themeQuery.length == 0) {
    await database.write(async () => {
      await database.get<Setting>("settings").create((setting) => {
        setting.type = "theme";
        setting.value = "Dark";
      });
    });
  }
  const firstDayQuery = await database
    .get("settings")
    .query(Q.where("type", "firstDay"));
  if (firstDayQuery.length == 0) {
    await database.write(async () => {
      await database.get<Setting>("settings").create((setting) => {
        setting.type = "firstDay";
        setting.value = "Monday";
      });
    });
  }
}
