import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { getRoomChatImages } from "../../../Services/Messages";
import { Icon } from "react-native-elements";
import {
  getUserRoomByID,
  getUserMessagesByID,
} from "../../../store/entities/chat";
import { getSelectedRoomID } from "../../../store/ui/chat";
import { getUserInfo } from "../../../store/entities/profile";
import { useSelector } from "react-redux";
import { AppImageViewer } from "../../../Components/AppImageViewer/index";
import { MessageImage } from "./Components/messageImage";

export const ChatInfo = (props) => {
  // The view width of the image container
  const [viewWidth, setViewWidth] = useState(0);
  // Determines if the image viewer should display
  const [showImageViewer, setShowImageViewer] = useState(false);
  // Image to show in the image viewer
  const [imageToView, setImageToView] = useState(null);
  // User's selected room ID
  const roomID = useSelector(getSelectedRoomID);
  // User's selected room
  const userRoom = useSelector(getUserRoomByID(roomID));
  // User's profile
  const userProfile = useSelector(getUserInfo);
  // Selected room messages
  const userRoomMessages = useSelector(getUserMessagesByID(roomID));
  // User's selected room images
  const userRoomImages = getRoomChatImages(userRoomMessages);

  /**
   * If an image is set to be shown, the image viewer will open. Otherwise,
   * the image viewer will be closed (if opened) and the image to be shown
   * will be reset
   */
  useEffect(() => {
    if (imageToView && showImageViewer) {
      setShowImageViewer(true);
    } else {
      setShowImageViewer(false);
      setImageToView(null);
    }
  }, [imageToView, showImageViewer]);

  if (userRoom && userProfile && userRoomImages) {
    return (
      <Modal
        visible={props.visible}
        presentationStyle="pageSheet"
        animationType="slide"
      >
        <View style={styles.touchableWithout}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Chat Details</Text>
            <TouchableOpacity
              title="Close Modal"
              onPress={() => props.setVisible(false)}
            >
              <Icon name="close" type="material" color="#002F64" size={30} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {/* USERSs */}
            <View style={styles.usersContainer}>
              <Text style={styles.usersContainerText}>Users</Text>
              {userRoom.users
                // Gets all users in the room except the main user
                .filter((user) => user.id !== userProfile.ID)
                // Sorts the users by their name
                .sort((a, b) =>
                  a.username === b.username
                    ? 0
                    : a.username < b.username
                    ? -1
                    : 1
                )
                .map((user, index) => {
                  return (
                    <View key={index} style={styles.userItem}>
                      {user.image && typeof user.image === "string" ? (
                        // If the message has an image and the image is a string (aka base64)
                        <Image
                          source={{ uri: user.image }}
                          style={styles.userImage}
                        />
                      ) : (
                        // Since there's no image, a default image is supplied instead
                        <Icon
                          name={"user-circle-o"}
                          type="font-awesome"
                          color="white"
                          solid={true}
                          size={styles.userImage.height}
                        />
                      )}
                      <Text numberOfLines={1} style={styles.userName}>
                        {user.username}
                      </Text>
                    </View>
                  );
                })}
            </View>

            {/* IMAGES */}
            <View style={styles.imagesMainContainer}>
              <Text style={styles.imagesMainContainerText}>Images</Text>
              <View
                onLayout={(e) => {
                  setViewWidth(e.nativeEvent.layout.width / 2 - 10);
                }}
                style={styles.imagesContainer}
              >
                {userRoomImages.map((message, index) => {
                  return (
                    <MessageImage
                      key={index}
                      image={message.image}
                      viewWidth={viewWidth}
                      setImageToView={setImageToView}
                      setShowImageViewer={setShowImageViewer}
                    />
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Image Viewer */}
        <AppImageViewer
          image={imageToView}
          visible={showImageViewer}
          setVisible={setShowImageViewer}
        />
      </Modal>
    );
  } else return <></>;
};

const styles = StyleSheet.create({
  touchableWithout: { flex: 1 },
  title: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    width: "80%",
    marginVertical: 20,
  },
  titleText: {
    color: "#002F64",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  usersContainer: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 30,
  },
  usersContainerText: {
    color: "#3C6AA8",
    fontSize: 20,
    fontWeight: "600",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C6AA8",
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 5,
    borderWidth: 1,
    marginTop: 10,
  },
  userImage: {
    width: 36,
    height: 36,
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#014983",
  },
  userName: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "500",
    color: "white",
    flex: 1,
  },
  imagesMainContainer: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 30,
  },
  imagesMainContainerText: {
    color: "#3C6AA8",
    fontSize: 20,
    fontWeight: "600",
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 5,
    marginTop: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
});
