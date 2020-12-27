import React from "react";
import {
  View,
  TouchableOpacity,
  Linking,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements";

/**
 * Returns the action buttons and passes in different handlers as props
 * @param {*} props The original props that GiftedChat created
 * @param {*} ImageHandler An Image handler that handles the user selected images
 * @param {*} ModalHandler Modal handler that handles the visibility and style of the custom modal
 */
export function renderActions(props, ImageHandler, ModalHandler) {
  return <Actions ImageHandler={ImageHandler} ModalHandler={ModalHandler} />;
}

/**
 * Renders the Action buttons in the InputToolbar
 * @param {JSON} props Props passed from parent
 */
const Actions = (props) => (
  <View
    style={[
      styles.container,
      {
        marginBottom: 8,
        marginTop:
          JSON.parse(props.ImageHandler.selectedImages).length > 0 ? 8 : -3,
      },
    ]}
  >
    {/***** IMAGE PICKER *****/}
    <TouchableOpacity
      onPress={() => {
        ImagePicker.getCameraPermissionsAsync().then(async (permission) => {
          // If the permission is granted, the user's photo library is opened
          if (permission.granted) {
            let image = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: false,
              quality: undefined,
              base64: true,
            });
            if (!image.cancelled) {
              let newSelectedImages = JSON.parse(
                props.ImageHandler.selectedImages
              );
              // newSelectedImages.push(`data:image/gif;base64,${image.base64}`);
              newSelectedImages.push(image.uri);
              /**
               * The images are set in a JSON object in order for useEffect() in
               * components to recognize the list of images have changed
               */
              props.ImageHandler.setSelectedImages(
                JSON.stringify(newSelectedImages)
              );
            }
          }
          // If permission is denied
          else {
            // If it's possible to ask for permission, the user is asked for permission
            if (permission.canAskAgain) {
              ImagePicker.requestCameraPermissionsAsync();
            }
            // If it's not possible to ask for permission, the user is directed to their settings
            // to enable permissions for the app
            else {
              // The new configuration for the modal
              let newModalConfig = { ...props.ModalHandler.modalConfig };

              /**
               * The modal's configuration is set to allow the user to cancel
               * choosing an image or go into the app's settings to enable the permission
               * of accessing the camera.
               */
              newModalConfig.content = (
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
                          // The new configuration for the modal
                          let newModalConfigTwo = {
                            ...props.ModalHandler.modalConfig,
                          };
                          newModalConfigTwo.visible = false;
                          props.ModalHandler.setModalConfig(newModalConfigTwo);
                        }}
                      >
                        <Text
                          style={[
                            styles.modalButtonText,
                            styles.modalButtonCancelText,
                          ]}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modalButtonSettings, styles.modalButton]}
                        onPress={() => {
                          Linking.openSettings();
                        }}
                      >
                        <Text
                          style={[
                            styles.modalButtonText,
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
              newModalConfig.visible = true;
              newModalConfig.height = 0;
              newModalConfig.contain = false;
              newModalConfig.cover = true;
              newModalConfig.styles = styles.modalStyles;

              props.ModalHandler.setModalConfig(newModalConfig);
            }
          }
        });
      }}
    >
      <Icon
        containerStyle={styles.imageButton}
        type="material"
        name="insert-photo"
        size={40}
        color="#028af8"
      />
    </TouchableOpacity>

    {/***** VIDEO PICKER *****/}
    <TouchableOpacity
      disabled={true} /* Remove disabled when a video picker is available */
    >
      <Icon
        containerStyle={styles.videoButton}
        type="material"
        name="movie"
        size={40}
        color="grey" // Change back to "#028af8" when a video picker is available
      />
    </TouchableOpacity>
  </View>
);

// Border radius style of the modal
const modalRadius = { borderTopLeftRadius: 16, borderTopRightRadius: 16 };

// The style of this component
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flexDirection: "row",
  },
  imageButton: {
    marginHorizontal: 5,
  },
  videoButton: {
    marginHorizontal: 10,
  },
  modalStyles: {
    overflow: "visible",
    ...modalRadius,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    ...modalRadius,
    marginVertical: 10,
  },
  modalContainerActions: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  modalTextTitle: {
    fontSize: 17,
    marginBottom: 10,
    color: "#012849",
  },
  modalButtonText: {
    fontSize: 20,
    padding: 10,
  },
  modalButton: {
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  modalButtonCancel: {
    backgroundColor: "white",
    borderWidth: 1,
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
