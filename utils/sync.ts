import { SyncDatabaseChangeSet, synchronize } from "@nozbe/watermelondb/sync";
import { database } from "./watermelon";
import { supabase } from "./supabase";
import { Session } from "@supabase/supabase-js";
import { Q } from "@nozbe/watermelondb";
import Note from "../model/Note";
import Feeling from "../model/Feeling";
import { ChangesData } from "../types";

export async function syncDatabase(
  setAlert: (message: string) => void,
  initialSync: boolean = false,
  // session given if we want to handle duplicates
  session?: Session | null
) {
  let syncedChanges = {} as ChangesData;
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      let lastPulledAtValue = lastPulledAt as number | null;
      if (initialSync) {
        lastPulledAtValue = null;
      }
      const { data, error } = await supabase.rpc("pull", {
        last_pulled_at: lastPulledAtValue,
      });
      if (error) {
        setAlert("Error: " + error.message);
      }
      const { changes: changesOriginal, timestamp } = data as {
        changes: SyncDatabaseChangeSet;
        timestamp: number;
      };
      syncedChanges = structuredClone(changesOriginal) as ChangesData;

      if (session && !initialSync) {
        await mergeData();
      }

      async function mergeData() {
        //handle conflicts by deleting duplicates and prioritizing most recent data
        let notesChanges = syncedChanges.notes.updated;
        let notesChangesUpdated = [];
        for (const [index, note] of notesChanges.entries()) {
          //query db for a record with the same day
          const noteInDB = await database
            .get<Note>("notes")
            .query(Q.where("day", note.day));
          if (noteInDB.length > 0) {
            // if there's already a record for this day
            if (note.id != noteInDB[0].id) {
              // delete the least recent one
              if (noteInDB[0].updatedAt > note.updated_at) {
                // most recent is local so we delete on Supabase
                try {
                  await supabase
                    .from("notes")
                    .delete()
                    .eq("user_id", session?.user.id)
                    .eq("id", note.id);
                } catch (e) {
                  setAlert("Error: " + e);
                }
              } else {
                try {
                  // else we delete local data permanently
                  await database.write(async () => {
                    await noteInDB[0].destroyPermanently();
                  });
                  notesChangesUpdated.push(note);
                } catch (e) {
                  setAlert("Error: " + e);
                }
              }
            }
          }
        }
        let feelingsChanges = syncedChanges.feelings.updated;
        let feelingsChangesUpdated = [];
        for (const [index, feeling] of feelingsChanges.entries()) {
          const feelingInDB = await database
            .get<Feeling>("feelings")
            .query(Q.where("day", feeling.day));
          if (feelingInDB.length > 0) {
            if (feeling.id != feelingInDB[0].id) {
              if (feelingInDB[0].updatedAt > feeling.updated_at) {
                // most recent is local so we delete on Supabase
                try {
                  await supabase
                    .from("feelings")
                    .delete()
                    .eq("user_id", session?.user.id)
                    .eq("id", feeling.id);
                } catch (e) {
                  setAlert("Error: " + e);
                }
              } else {
                try {
                  // else we delete local data permanently
                  await database.write(async () => {
                    await feelingInDB[0].destroyPermanently();
                  });
                  feelingsChangesUpdated.push(feeling);
                } catch (e) {
                  setAlert("Error: " + e);
                }
              }
            }
          }
        }
        notesChanges = notesChangesUpdated;
        feelingsChanges = feelingsChangesUpdated;
      }
      const changes = syncedChanges as SyncDatabaseChangeSet;
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const { error } = await supabase.rpc("push", { changes });

      if (error) {
        setAlert("Error: " + error.message);
      }
    },
    sendCreatedAsUpdated: true,
    migrationsEnabledAtVersion: 2,
  });
}
