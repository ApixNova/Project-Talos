import { SyncDatabaseChangeSet, synchronize } from "@nozbe/watermelondb/sync";
import { database } from "./watermelon";
import { supabase } from "./supabase";
import { Session } from "@supabase/supabase-js";
import { Q } from "@nozbe/watermelondb";
import Note from "../model/Note";
type ChangesData = {
  notes: {
    created: [];
    deleted: string[];
    updated: [
      {
        id: string;
        day: string;
        title: string;
        content: string;
        created_at: number;
        updated_at: number;
      }
    ];
  };
  feelings: {
    created: [];
    deleted: string[];
    updated: [
      {
        id: string;
        day: string;
        type: number;
        // created_at: number;
        // updated_at: number;
      }
    ];
  };
};
export async function syncDatabase(
  setAlert: (message: string) => void,
  initialSync: boolean = false,
  // session given if we want to handle duplicates
  session?: Session | null
) {
  let syncedChanges = {} as ChangesData;
  console.log("Sync called");
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      console.log(lastPulledAt);
      let lastPulledAtValue = lastPulledAt as number | null;
      if (initialSync) {
        lastPulledAtValue = null;
      }
      console.log(lastPulledAtValue);
      const { data, error } = await supabase.rpc("pull", {
        last_pulled_at: lastPulledAtValue,
      });
      console.log("Data: " + JSON.stringify(data));
      if (error) {
        setAlert("Error: " + error.message);
      }
      const { changes: changesOriginal, timestamp } = data as {
        changes: SyncDatabaseChangeSet;
        timestamp: number;
      };
      syncedChanges = structuredClone(changesOriginal) as ChangesData;

      if (session && !initialSync) mergeData();

      async function mergeData() {
        console.log("merge data called");
        //handle conflicts by deleting duplicates and prioritizing most recent data
        let noteChanges = syncedChanges.notes.updated;
        for (const [index, note] of noteChanges.entries()) {
          //query db for a record with the same day
          const noteInDB = await database
            .get<Note>("notes")
            .query(Q.where("day", note.day));
          if (noteInDB.length > 0) {
            // if there's already a record for this day
            if (note.id != noteInDB[0].id) {
              // delete the least recent one
              if (noteInDB[0].updatedAt > note.updated_at) {
                // most recent is local so we delete from Supabase
                try {
                  await supabase
                    .from("notes")
                    .delete()
                    .eq("user_id", session?.user.id)
                    .eq("id", note.id);
                  console.log("deleted supabase note");
                } catch (e) {}
                noteChanges.splice(index, 1);
              } else {
                try {
                  // else we delete local data permanently
                  await noteInDB[0].destroyPermanently();
                  console.log("deleted local note");
                } catch (e) {}
              }
            }
          }
        }
        // for (const id of syncedChanges.notes.deleted) {
        // }
      }
      console.log("Changes: " + JSON.stringify(changesOriginal));
      console.log("Changes updated: " + JSON.stringify(syncedChanges));
      const changes = syncedChanges as SyncDatabaseChangeSet;
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log("changes debug: " + JSON.stringify(changes));
      const { error } = await supabase.rpc("push", { changes });

      if (error) {
        setAlert("Error: " + error.message);
      }
    },
    sendCreatedAsUpdated: true,
    migrationsEnabledAtVersion: 2,
  });
  console.log(
    "Sync complete, changes object that I should return: " +
      JSON.stringify(syncedChanges)
  );
  return syncedChanges;
}
