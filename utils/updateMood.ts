import { Q } from "@nozbe/watermelondb";
import Feeling from "../model/Feeling";
import { database } from "./watermelon";

export async function updateMood(moodType: number, selectedDay: string) {
  //compare with queried moods
  const existsInDatabase = await database
    .get<Feeling>("feelings")
    .query(Q.where("day", selectedDay));
  if (existsInDatabase.length > 0) {
    if (existsInDatabase[0].type != moodType) {
      //if it exists already and is different, modify element
      await database.write(async () => {
        await existsInDatabase[0].update(() => {
          existsInDatabase[0].type = moodType;
        });
      });
    }
  } else {
    //otherwise create one
    await database.write(async () => {
      await database.get<Feeling>("feelings").create((mood) => {
        mood.type = moodType;
        mood.day = selectedDay;
      });
    });
  }
}
