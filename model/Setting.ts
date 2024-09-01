import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export default class Setting extends Model {
  static table = "settings";

  @field("type") type!: string;
  @field("value") value!: string;
}
