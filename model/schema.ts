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
  ],
});
