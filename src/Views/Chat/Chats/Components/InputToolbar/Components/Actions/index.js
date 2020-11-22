import React from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Linking,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

export function renderActions(
  props,
  setSelectedImage,
  setModalVisible,
  setModalContent,
  setModalContain,
  setModalCover,
  setModalHeight,
  setModalStyles
) {
  return (
    <Actions
      setSelectedImage={setSelectedImage}
      setModalVisible={setModalVisible}
      setModalContent={setModalContent}
      setModalContain={setModalContain}
      setModalCover={setModalCover}
      setModalHeight={setModalHeight}
      setModalStyles={setModalStyles}
    />
  );
}

/**
 * Renders the Action buttons in the InputToolbar
 * @param {JSON} props Props passed from parent
 */
const Actions = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          ImagePicker.getCameraPermissionsAsync().then(async (permission) => {
            // If the permission is granted, the user's photo library is opened
            if (permission.granted === "hi") {
              let image = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: false,
                quality: undefined,
                base64: true,
              });
              if (!image.cancelled)
                props.setSelectedImage(`data:image/gif;base64,${image.base64}`);
            }
            // If permission is denied
            else {
              // If it's possible to ask for permission, the user is asked for permission
              if (permission.canAskAgain === "hi") {
                ImagePicker.requestCameraPermissionsAsync();
              }
              // If it's not possible to ask for permission, the user is directed to their settings
              // to enable permissions for the app
              else {
                props.setModalStyles({
                  borderColor: "#014983",
                  borderWidth: 2,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  borderBottomWidth: 0,
                });
                props.setModalContent(
                  <View style={styles.modalContainer}>
                    <SafeAreaView edges={["bottom"]}>
                      <Text style={styles.modalTextTitle}>
                        Please enable camera permissions for the app inside of
                        Settings.
                      </Text>
                      <View style={styles.modalContainerActions}>
                        <TouchableOpacity
                          style={[styles.modalButtonCancel, styles.modalButton]}
                          onPress={() => {
                            props.setModalStyles({});
                            props.setModalVisible(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.modalText,
                              styles.modalButtonCancelText,
                            ]}
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.modalButtonSettings,
                            styles.modalButton,
                          ]}
                          onPress={() => {
                            Linking.openSettings();
                          }}
                        >
                          <Text
                            style={[
                              styles.modalText,
                              styles.modalButtonSettingsText,
                            ]}
                          >
                            Open Settings
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </SafeAreaView>
                  </View>
                );
                props.setModalCover(true);
                props.setModalContain(false);
                props.setModalHeight(0);
                props.setModalVisible(true);
              }
            }
          });
        }}
      >
        <Image
          style={styles.imageButton}
          source={require("../Images/image.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.videoButton}
          source={require("../Images/video.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    alignSelf: "center",
    flexDirection: "row",
  },
  imageButton: {
    width: 39,
    height: 39,
    tintColor: "#92C7FF",
    marginHorizontal: 5,
  },
  videoButton: {
    width: 36,
    height: 36,
    tintColor: "#92C7FF",
    marginHorizontal: 5,
  },
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.02)",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#014983",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  modalContainerActions: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  modalTextTitle: {
    fontSize: 17,
  },
  modalText: {
    fontSize: 20,
    marginVertical: 10,
  },
  modalButton: {
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  modalButtonCancel: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#014983",
  },
  modalButtonCancelText: {
    color: "#014983",
  },
  modalButtonSettings: {
    backgroundColor: "#014983",
    marginLeft: 50,
  },
  modalButtonSettingsText: {
    color: "white",
  },
});
