import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { palette } from "../utils/palette";
import { useState } from "react";
import { PickerProps } from "../types";

export default function Picker({
  title,
  options,
  state,
  setState,
}: PickerProps) {
  const [visible, setVisible] = useState(false);
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
            <View style={styles.container}>
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
                        styles.text,
                        option == state ? styles.selected : undefined,
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
    backgroundColor: palette.background,
    borderWidth: 2,
    borderColor: palette.rose,
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
    color: palette.accent,
    fontFamily: "Inter_400Regular",
    fontSize: 20,
  },
  option: {
    color: "white",
    margin: "auto",
    width: "100%",
  },
  selected: {
    color: palette.text,
    // borderWidth: 2,
    // borderColor: "white",
    backgroundColor: palette.rose,
  },
});
