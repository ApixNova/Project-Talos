import { Q } from "@nozbe/watermelondb";
import { database } from "./watermelon";
import { editNote } from "../state/noteSlice";
import { serializeNote } from "./functions";
import { ReloadNotesProps } from "../types";
import Note from "../model/Note";

export default async function reloadNotes({ dispatch }: ReloadNotesProps) {
  const notesQuery = (await database
    .get("notes")
    .query(Q.sortBy("day", Q.desc), Q.take(10))) as Note[];
  if (notesQuery.length > 0) {
    const serializedNotes = notesQuery.map((note) => serializeNote(note));
    console.log("NOTES: " + JSON.stringify(serializedNotes));
    dispatch(editNote(serializedNotes));
  } else {
    dispatch(editNote([]));
  }
}
