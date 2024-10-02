import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Setting from "../model/Setting";
import { useAppSelector } from "../state/hooks";
import { PickerProps } from "../types";
import { dynamicTheme } from "../utils/palette";

export default function Picker({
  title,
  options,
  state,
  setState,
}: PickerProps) {
  const [visible, setVisible] = useState(false);
  const settings = useAppSelector((state) => state.settings as Setting[]);
  function handlePress(option: string) {
    setState(option);
    setVisible(false);
  }
  return (
    <>
      <SafeAreaView>
        <Pressable
          onPress={() => {
            setVisible(true);
          }}
        >
          <Text style={styles.text}>{title}</Text>
        </Pressable>
      </SafeAreaView>
      {visible && (
        <Modal animationType="fade" transparent={true}>
          <View style={styles.background}>
            <View
              style={[
                styles.container,
                {
                  backgroundColor: dynamicTheme(settings, "background"),
                  borderColor: dynamicTheme(settings, "rose"),
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  setVisible(false);
                }}
              >
                <FontAwesome
                  style={styles.close}
                  name="close"
                  size={24}
                  color="white"
                />
              </Pressable>
              {options.map((option, index) => {
                return (
                  <Pressable
                    key={index}
                    style={styles.option}
                    onPress={() => handlePress(option)}
                  >
                    <Text
                      selectable={false}
                      style={[
                        styles.textList,
                        option == state
                          ? [
                              styles.selected,
                              {
                                color: dynamicTheme(settings, "text"),
                                backgroundColor: dynamicTheme(settings, "rose"),
                              },
                            ]
                          : undefined,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    // position: "absolute",
    backgroundColor: "rgba(24, 36, 74, 0.6)",
  },
  container: {
    // backgroundColor: palette.background,
    borderWidth: 2,
    // borderColor: palette.rose,
    // width: "85%",
    minWidth: 200,
    paddingHorizontal: 13,
    paddingBottom: 10,
    maxWidth: 470,
    margin: "auto",
    minHeight: 70,
    // height: "70%",
  },
  close: {
    // marginLeft: 10,
    marginTop: 7,
    marginBottom: 15,
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
  },
  textList: {
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    color: "white",
  },
  option: {
    // color: "white",
    // margin: "auto",
    padding: 5,
    // width: "100%",
  },
  selected: {
    // color: palette.text,
    // borderWidth: 2,
    // borderColor: "white",
    // backgroundColor: palette.rose,
  },
});
