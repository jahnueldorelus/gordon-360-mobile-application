import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Linking,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getRoomImage, setRoomImage } from "../../../../../../store/ui/chat";

export const RoomImagePicker = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // The room's image
  const roomImage = useSelector(getRoomImage);

  useEffect(() => {
    // Deletes the temporary room image if there are no selected users
    if (props.selectedUsersListLength === 0) {
      dispatch(setRoomImage(null));
    }
  }, [props.selectedUsersListLength]);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainContainerText}>Room Image:</Text>
      {!roomImage ? (
        // If the user hasn't selected an image for the new room
        <TouchableOpacity
          onPress={() => {
            ImagePicker.getCameraPermissionsAsync().then(async (permission) => {
              // If the permission is granted, the user's photo library is opened
              if (permission.granted) {
                const image = await ImagePicker.launchImageLibraryAsync({
                  allowsEditing: false,
                  quality: undefined,
                  base64: true,
                });
                // If an image is selected, the image is saved
                if (!image.cancelled) {
                  dispatch(setRoomImage(image.base64));
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
                  let newModalConfig = { ...props.modalConfig };

                  /**
                   * The modal's configuration is set to allow the user to cancel
                   * choosing an image or go into the app's settings to enable the permission
                   * of accessing the camera.
                   */
                  newModalConfig.content = (
                    <View>
                      <View style={styles.modalTextTitleContainer}>
                        <Text style={styles.modalTextTitle}>
                          Please enable camera permissions for the app inside of
                          Settings.
                        </Text>
                      </View>
                      <View style={styles.modalContainerActions}>
                        <TouchableOpacity
                          style={[styles.modalButtonCancel, styles.modalButton]}
                          onPress={() => {
                            // The new configuration for the modal
                            let newModalConfigTwo = { ...props.modalConfig };
                            newModalConfigTwo.visible = false;
                            props.setModalConfig(newModalConfigTwo);
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
                              styles.modalButtonText,
                              styles.modalButtonSettingsText,
                            ]}
                          >
                            Open Settings
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                  newModalConfig.visible = true;
                  newModalConfig.styles = styles.modalStyles;
                  props.setModalConfig(newModalConfig);
                }
              }
            });
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>
      ) : (
        // If the user has selected an image for the new room
        <View style={styles.mainContainerWithRoom}>
          <Image
            source={{ uri: "data:image/gif;base64," + roomImage }}
            style={styles.roomImage}
          />
          <View style={styles.mainIconsContainer}>
            <TouchableOpacity
              style={[styles.imageIconContainer, { marginBottom: 15 }]}
              onPress={async () => {
                const image = await ImagePicker.launchImageLibraryAsync({
                  allowsEditing: false,
                  quality: undefined,
                  base64: true,
                });
                // If an image is selected
                if (!image.cancelled) {
                  dispatch(setRoomImage(image.base64));
                }
              }}
            >
              <Icon
                containerStyle={styles.imageIcon}
                name={"edit"}
                type="font-awesome-5"
                size={styles.imageIcon.height}
                color="white"
              />
              <Text style={styles.imageIconText}>Replace</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageIconContainer}
              onPress={() => dispatch(setRoomImage(null))}
            >
              <Icon
                containerStyle={styles.imageIcon}
                name="trash"
                type="font-awesome-5"
                size={styles.imageIcon.height}
                color="white"
              />
              <Text style={styles.imageIconText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Border radius style of the modal
const modalRadius = { borderTopLeftRadius: 16, borderTopRightRadius: 16 };

// The style of this component
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    marginHorizontal: "5%",
    marginTop: "5%",
    alignItems: "center",
    marginBottom: "2%",
  },
  mainContainerText: {
    fontSize: 18,
    marginRight: 10,
    fontWeight: "bold",
    color: "#014983",
  },
  mainContainerWithRoom: { flexDirection: "row" },
  button: { backgroundColor: "#074f87", padding: 10, borderRadius: 10 },
  buttonText: { fontSize: 16, color: "white", fontWeight: "500" },
  roomImage: {
    width: Dimensions.get("window").height * 0.1,
    height: Dimensions.get("window").height * 0.1,
    borderRadius: 50,
    marginRight: 15,
    alignSelf: "center",
    // resizeMode: "contain",
    borderWidth: 0.5,
    borderColor: "#014983",
  },
  mainIconsContainer: { justifyContent: "center" },
  imageIconContainer: {
    flexDirection: "row",
    backgroundColor: "#014983",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  imageIcon: { marginHorizontal: 10, height: 20 },
  imageIconText: {
    fontWeight: "500",
    fontSize: 15,
    color: "white",
    paddingRight: 10,
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
  modalContainerActions: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  modalTextTitleContainer: {
    ...modalRadius,
    backgroundColor: "#012849",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalTextTitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  modalButtonText: {
    fontSize: 20,
    padding: 10,
  },
  modalButton: {
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
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
