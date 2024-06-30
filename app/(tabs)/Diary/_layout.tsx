import { Stack } from "expo-router";
import { moodColor } from "../../../utils/palette";

export default function DiaryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Edit Note",
          // headerShown: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: moodColor.black,
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Inter_400Regular",
          },
        }}
      />
    </Stack>
  );
}
