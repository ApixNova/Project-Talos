import { View, Text, StyleSheet } from "react-native";
import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";

export default function Screen() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_900Black,
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: "Inter_900Black",
          // fontSize: 40
        }}
      >
        Options
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    height: "100%",
  },
});
