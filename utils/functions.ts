import { Note } from "../types";
import { moodColor } from "./palette";

//returns current date in YYYY-MM-DD format taking into account the timezone
export function getCurrentDate() {
  const currentDate = new Date();
  const offset = currentDate.getTimezoneOffset();
  const shiftedDate = new Date(currentDate.getTime() - offset * 60 * 1000);
  return shiftedDate.toISOString().split("T")[0];
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
