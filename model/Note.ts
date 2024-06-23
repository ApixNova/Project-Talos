import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class Note extends Model {
  static table = "notes";

  @text("day") day!: string;
  @text("title") title!: string;
  @text("content") content!: string;
  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
}
