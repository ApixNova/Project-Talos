import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Page() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Note id: {id}</Text>
      <Text>Editable note here</Text>
    </View>
  );
}
