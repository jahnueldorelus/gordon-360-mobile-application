import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "react-native-elements";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getNewRoomImage } from "../../../../../../store/ui/Chat/chatSelectors";
import { setNewRoomImage } from "../../../../../../store/ui/Chat/chat";

export const RoomImagePicker = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // The room's image
  const roomImage = useSelector(getNewRoomImage);

  useEffect(() => {
    // Deletes the temporary room image if there are no selected users
    if (props.selectedUsersListLength === 0) {
      dispatch(setNewRoomImage(null));
    }
  }, [props.selectedUsersListLength]);

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <Text style={styles.mainContainerText}>Room Image:</Text>
        <View style={{ alignItems: "center", flex: 1 }}>
          {!roomImage ? (
            // If the user hasn't selected an image for the new room
            <TouchableOpacity
              activeOpacity={0.75}
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
                        dispatch(setNewRoomImage(image.base64));
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
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  // Opens the image viewer
                  props.setShowImageViewer(true)
                }
                style={styles.roomImageContainer}
              >
                <Image
                  source={{ uri: "data:image/gif;base64," + roomImage }}
                  style={styles.roomImage}
                />
              </TouchableOpacity>
              <View style={styles.mainIconsContainer}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={styles.imageIconContainer}
                  onPress={() => dispatch(setNewRoomImage(null))}
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
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={[styles.imageIconContainer]}
                  onPress={async () => {
                    const image = await ImagePicker.launchImageLibraryAsync({
                      allowsEditing: false,
                      quality: undefined,
                      base64: true,
                    });
                    // If an image is selected
                    if (!image.cancelled) {
                      dispatch(setNewRoomImage(image.base64));
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
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Sets the dimensions of the room image
const imageDimensionSize =
  Dimensions.get("window").height > Dimensions.get("window").width
    ? Dimensions.get("window").height * 0.1
    : Dimensions.get("window").width * 0.1;

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
  mainContainerWithRoom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: { backgroundColor: "#074f87", padding: 10, borderRadius: 10 },
  buttonText: { fontSize: 16, color: "white", fontWeight: "500" },
  roomImageContainer: {
    borderRadius: 100,
    width: imageDimensionSize,
    height: imageDimensionSize,
    overflow: "hidden",
    marginHorizontal: 20,
    borderWidth: 0.5,
    borderColor: "#014983",
  },
  roomImage: {
    width: imageDimensionSize,
    height: imageDimensionSize,
    borderRadius: 50,
    alignSelf: "center",
  },
  mainIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  imageIconContainer: {
    flexDirection: "row",
    backgroundColor: "#014983",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 10,
  },
  imageIcon: { marginHorizontal: 10, height: 20 },
  imageIconText: {
    fontWeight: "500",
    fontSize: 15,
    color: "white",
    paddingRight: 10,
  },
});
