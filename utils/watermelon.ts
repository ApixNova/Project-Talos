import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import migrations from "../model/migrations";
import schema from "../model/schema";
import Feeling from "../model/Feeling";
import Note from "../model/Note";
import Setting from "../model/Setting";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: "talos",
  // jsi: true,
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Feeling, Note, Setting],
});
