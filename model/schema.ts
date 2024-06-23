import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "feelings",
      columns: [
        { name: "type", type: "number" },
        { name: "day", type: "string" },
      ],
    }),
    tableSchema({
      name: "notes",
      columns: [
        { name: "day", type: "string" },
        { name: "title", type: "string" },
        { name: "content", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
