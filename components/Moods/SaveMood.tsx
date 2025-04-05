import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Setting from "../../model/Setting";
import { useAppSelector } from "../../state/hooks";
import { SaveMoodProps } from "../../types";
import { dynamicTheme } from "../../utils/palette";
import { updateMood } from "../../utils/updateMood";
import MoodPicker from "./MoodPicker";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function SaveMood({ props }: SaveMoodProps) {
  const { setMoods, selectedDay, open } = props;
  const moods = useAppSelector((state) => state.moods.value);
  const settings = useAppSelector((state) => state.settings as Setting[]);

  const toggle = () => {
    open.value = !open.value;
  };
  const derivedHeight = useDerivedValue(() => {
    return withTiming(20 * Number(open.value), { duration: 500 });
  });
  const derivedOpacity = useDerivedValue(() => {
    return withSpring(Number(open.value));
  });
  const animatedStyle = useAnimatedStyle(() => ({
    bottom: derivedHeight.value,
    opacity: derivedOpacity.value,
    display: open.value ? "flex" : "none",
  }));
  const animatedToggle = useAnimatedStyle(() => ({
    opacity: 1 - derivedOpacity.value,
  }));
  async function handlePress(moodType: number) {
    function closePicker() {
      setTimeout(() => {
        toggle();
      }, 450);
    }
    if (moods[selectedDay] == moodType) {
      closePicker();
      return;
    }
    await updateMood(moodType, selectedDay);
    //update state
    let moodsList = JSON.parse(JSON.stringify(moods));
    moodsList[selectedDay] = moodType;
    setMoods(moodsList);
    closePicker();
  }
  return (
    <>
      <Animated.View style={[styles.plus, animatedToggle]}>
        <Pressable
          onPress={toggle}
          style={{
            width: 70,
            height: 70,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome
            name="plus"
            size={60}
            color={dynamicTheme(settings, "text")}
          />
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[
          styles.containerBackground,
          animatedStyle,
          {
            backgroundColor: dynamicTheme(settings, "background"),
          },
        ]}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: dynamicTheme(settings, "primary", 25),
            },
          ]}
        >
          <Pressable
            style={styles.close}
            onPress={() => {
              toggle();
            }}
          >
            <FontAwesome
              name="close"
              size={30}
              color={dynamicTheme(settings, "text")}
            />
          </Pressable>
          <Text
            style={[
              styles.title,
              {
                color: dynamicTheme(settings, "text"),
              },
            ]}
          >
            How was your day ?
          </Text>
          <MoodPicker handlePress={handlePress} />
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  containerBackground: {
    borderRadius: 10,
    position: "absolute",
    overflow: "hidden",
  },
  container: {
    padding: 15,
  },
  plus: {
    marginVertical: "auto",
  },
  close: {
    marginRight: "auto",
  },
  title: {
    textAlign: "center",
    fontFamily: "Inter-Medium",
    padding: 5,
    fontSize: 20,
    color: "#0c0414",
  },
});
