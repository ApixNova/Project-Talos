import { Stack } from "expo-router";
import { moodColor } from "../../../utils/palette";

export default function DiaryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Diary",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: moodColor.black,
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Edit Note",
          // headerShown: false,
        }}
      />
    </Stack>
  );
}
