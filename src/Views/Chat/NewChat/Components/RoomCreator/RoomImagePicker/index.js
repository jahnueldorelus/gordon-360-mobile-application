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
          onPress={async () => {
            await ImagePicker.getCameraPermissionsAsync().then(
              async (permission) => {
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
                    await ImagePicker.requestCameraPermissionsAsync();
                  }
                  // If it's not possible to ask for permission, the user is directed to enable
                  // camera permissions in their device settings
                  else {
                    props.setShowCamPermissSettings(true);
                  }
                }
              }
            );
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
});
