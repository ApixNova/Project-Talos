import {
  createTable,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: "settings",
          columns: [
            { name: "type", type: "string" },
            { name: "value", type: "string" },
          ],
        }),
      ],
    },
  ],
});
