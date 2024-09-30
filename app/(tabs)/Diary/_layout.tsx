import { Stack, useNavigation } from "expo-router";
import { palette } from "../../../utils/palette";
import {
  Platform,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationType } from "../../../types";

export default function DiaryLayout() {
  const navigation = useNavigation<NavigationType>();
  const { width } = useWindowDimensions();

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
        options={{
          title: "Edit Note",
          // headerShown: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: palette.black,
          },
          // headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              style={styles.headerButton}
              onPress={() => {
                navigation.navigate("index");
              }}
            >
              <Ionicons name="chevron-back-outline" size={27} color="white" />
              {Platform.OS == "web" && width > 465 && (
                <Text style={styles.text}>Back</Text>
              )}
            </Pressable>
          ),
          // headerBackImageSource: image,
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
