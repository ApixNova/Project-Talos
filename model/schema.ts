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
        { name: "id", type: "string" },
        { name: "date", type: "string" },
        { name: "mood", type: "number" },
        { name: "title", type: "string" },
        { name: "content", type: "string" },
        { name: "created_at", type: "number" },
      ],
    }),
  ],
});
