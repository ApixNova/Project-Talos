import { SyncDatabaseChangeSet, synchronize } from "@nozbe/watermelondb/sync";
import { database } from "./watermelon";
import { supabase } from "./supabase";

export async function syncDatabase(
  setAlert: (message: string) => void,
  initialSync: boolean = false
) {
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
      console.log(data);
      if (error) {
        setAlert("Error: " + error.message);
      }
      const { changes, timestamp } = data as {
        changes: SyncDatabaseChangeSet;
        timestamp: number;
      };
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
}
