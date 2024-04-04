import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class Feeling extends Model {
  static table = "feelings";

  @field("type") type!: number;
  @text("day") day!: string;
}
