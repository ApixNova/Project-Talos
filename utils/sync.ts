import { SyncDatabaseChangeSet, synchronize } from "@nozbe/watermelondb/sync";
import { database } from "./watermelon";
import { supabase } from "./supabase";

export async function syncDatabase() {
  console.log("Sync called");
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const { data, error } = await supabase.rpc("pull", {
        last_pulled_at: lastPulledAt,
      });
      if (error) {
        throw new Error("🍉".concat(error.message));
      }
      const { changes, timestamp } = data as {
        changes: SyncDatabaseChangeSet;
        timestamp: number;
      };
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const { error } = await supabase.rpc("push", { changes });

      // console.log("changes debug: " + JSON.stringify(changes));
      if (error) {
        throw new Error("🍉".concat(error.message));
      }
    },
    sendCreatedAsUpdated: true,
    migrationsEnabledAtVersion: 2,
  });
}
