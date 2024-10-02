import { FontAwesome } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Setting from "../model/Setting";
import { useAppSelector } from "../state/hooks";
import { dynamicTheme } from "../utils/palette";

export default function AlertComponent({
  message,
  visible,
  setShowAlert,
  giveChoice,
  handleConfirm,
  handleExit,
}: {
  message: string;
  visible?: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  giveChoice?: boolean;
  handleConfirm?: () => void;
  handleExit?: () => void;
}) {
  const settings = useAppSelector((state) => state.settings as Setting[]);
  function close() {
    setShowAlert(false);
  }
  return (
    <View>
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
                  if (handleExit) handleExit();
                  close();
                }}
                style={styles.closeContainer}
              >
                <FontAwesome
                  style={styles.close}
                  name="close"
                  size={24}
                  color="white"
                />
              </Pressable>
              <Text style={styles.text}>{message}</Text>
              <View style={styles.buttonContainer}>
                {giveChoice && handleConfirm && handleExit ? (
                  <>
                    <Pressable
                      style={[
                        styles.button,
                        { backgroundColor: dynamicTheme(settings, "rose") },
                      ]}
                      onPress={() => {
                        handleConfirm();
                        close();
                      }}
                    >
                      <Text style={styles.text} selectable={false}>
                        Yes
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.button,
                        { backgroundColor: dynamicTheme(settings, "primary") },
                      ]}
                      onPress={() => {
                        handleExit();
                        close();
                      }}
                    >
                      <Text style={styles.text} selectable={false}>
                        No
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable style={styles.button} onPress={close}>
                    <Text style={styles.text} selectable={false}>
                      Ok
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(24, 36, 74, 0.6)",
  },
  container: {
    // backgroundColor: palette.background,
    borderWidth: 2,
    // borderColor: palette.rose,
    width: "85%",
    minWidth: 200,
    paddingHorizontal: 13,
    paddingBottom: 10,
    maxWidth: 570,
    margin: "auto",
  },
  closeContainer: {
    marginRight: "auto",
  },
  close: {
    marginTop: 7,
    marginBottom: 11,
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: "auto",
    marginTop: 8,
    gap: 10,
  },
  button: {
    padding: 4,
    borderRadius: 7,
    // backgroundColor: palette.rose,
  },
});
