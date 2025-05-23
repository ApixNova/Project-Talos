import { Stack } from "expo-router";
import { dynamicTheme } from "../../../utils/palette";
import {
  Platform,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppSelector } from "../../../state/hooks";
import Setting from "../../../model/Setting";

export default function DiaryLayout() {
  const { width } = useWindowDimensions();
  const settings = useAppSelector((state) => state.settings as Setting[]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={({ navigation }) => ({
          title: "Edit Note",
          // headerShown: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: dynamicTheme(settings, "background"),
          },
          // headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              style={styles.headerButton}
              onPress={() => {
                navigation.popToTop();
              }}
            >
              <Ionicons
                name="chevron-back-outline"
                size={27}
                color={dynamicTheme(settings, "text")}
              />
              {Platform.OS == "web" && width > 465 && (
                <Text
                  style={[
                    styles.text,
                    { color: dynamicTheme(settings, "text") },
                  ]}
                >
                  Back
                </Text>
              )}
            </Pressable>
          ),
          headerTintColor: dynamicTheme(settings, "text"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Inter-Regular",
          },
        })}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginLeft: 13,
    flexDirection: "row",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
