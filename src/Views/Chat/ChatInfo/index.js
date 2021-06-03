import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import {
  getRoomChatImages,
  getNameFromUsername,
} from "../../../Services/Messages";
import { Icon } from "react-native-elements";
import {
  getUserRoomByID,
  getUserMessagesByID,
} from "../../../store/entities/chat";
import { getSelectedRoomID } from "../../../store/ui/Chat/chatSelectors";
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
  // User's profile
  const userProfile = useSelector(getUserInfo);
  // User's selected room
  const userRoom = useSelector(getUserRoomByID(roomID));
  // Room Users
  const roomUsers =
    userRoom && userRoom.users
      ? userRoom.users
          // Gets all users in the room except the main user
          .filter((user) => user.id !== userProfile.ID)
          // Sorts the users by their name
          .sort((a, b) =>
            a.username === b.username ? 0 : a.username < b.username ? -1 : 1
          )
      : [];
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

  /**
   * Key extractor for a FlatList component
   */
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  /**
   * Renders an item of the list of users for the selected room
   * Do not move the code belowo into the Flatlist. With it being separate
   * and the use of useCallback, a performance boost is created
   */
  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View
          key={index}
          style={[
            styles.userItem,
            {
              // Adds spacing at the beginning of the list
              marginLeft: index === 0 ? 30 : 15,
              // Adds spacing at the end of the list
              marginRight: index === roomUsers.length - 1 ? 30 : 0,
            },
          ]}
        >
          {item.image && typeof item.image === "string" ? (
            // If the message has an image and the image is a string (aka base64)
            <TouchableOpacity
              activeOpacity={0.75}
              title="Close Modal"
              onPress={() => {
                // Sets the image to view
                setImageToView(item.image);
                // Opens the image viewer
                setShowImageViewer(true);
              }}
            >
              <Image
                source={{
                  uri: `data:image/gif;base64,${item.image}`,
                }}
                style={styles.userImage}
              />
            </TouchableOpacity>
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
            {getNameFromUsername(item.username)}
          </Text>
        </View>
      );
    },
    [roomUsers]
  );

  if (userRoom && userProfile && userRoomImages) {
    return (
      <Modal
        visible={props.visible}
        presentationStyle="pageSheet"
        animationType="slide"
        style={{ backgroundColor: "white" }}
      >
        <View style={styles.touchableWithout}>
          <View style={styles.title}>
            <SafeAreaView style={styles.titleSafeArea}>
              <Text style={styles.titleText}>Chat Details</Text>
              <TouchableOpacity
                activeOpacity={0.75}
                title="Close Modal"
                onPress={() => props.setVisible(false)}
              >
                <Icon name="close" type="material" color="#002F64" size={30} />
              </TouchableOpacity>
            </SafeAreaView>
          </View>
          <ScrollView>
            {/* USERS */}
            <View style={styles.usersContainer}>
              <SafeAreaView>
                <Text style={styles.usersContainerText}>Users</Text>

                <FlatList
                  data={roomUsers}
                  keyExtractor={keyExtractor}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderItem}
                />
              </SafeAreaView>
            </View>

            {/* IMAGES */}
            <View style={styles.imagesMainContainer}>
              <SafeAreaView>
                <Text style={styles.imagesMainContainerText}>Images</Text>
                <View
                  onLayout={(e) => {
                    setViewWidth(e.nativeEvent.layout.width / 3);
                  }}
                  style={styles.imagesContainer}
                >
                  {userRoomImages.length > 0 ? (
                    userRoomImages.map((message, index) => {
                      return (
                        <MessageImage
                          key={index}
                          image={message.image}
                          createdAt={message.createdAt}
                          viewWidth={viewWidth}
                          setImageToView={setImageToView}
                          setShowImageViewer={setShowImageViewer}
                        />
                      );
                    })
                  ) : (
                    <Text style={styles.imagesContainerText}>
                      No images found in chat.
                    </Text>
                  )}
                </View>
              </SafeAreaView>
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
    alignSelf: "center",
    borderBottomWidth: 1,
    width: "80%",
    marginVertical: 20,
  },
  titleSafeArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    color: "#002F64",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  usersContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  usersContainerText: {
    marginHorizontal: 30,
    color: "#013e83",
    fontSize: 20,
    fontWeight: "600",
  },
  userItem: {
    alignItems: "center",
    backgroundColor: "#01335c",
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 5,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userImage: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 0.4,
    borderColor: "white",
  },
  userName: {
    marginHorizontal: 5,
    marginTop: 10,
    fontSize: 20,
    fontWeight: "500",
    color: "white",
    flex: 1,
  },
  imagesMainContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  imagesMainContainerText: {
    marginHorizontal: 30,
    color: "#013e83",
    fontSize: 20,
    fontWeight: "600",
  },
  imagesContainer: {
    marginHorizontal: 30,
    flexDirection: "row",
    paddingVertical: 10,
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  imagesContainerText: {
    color: "#013b6a",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
});
