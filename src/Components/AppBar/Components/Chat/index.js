import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import {
  getChatName,
  removeNotificationsInTray,
  getRoomImage,
} from "../../../../Services/Messages";
import { Icon } from "react-native-elements";
import { ChatInfo } from "../../../../Views/Chat/ChatInfo/index";
import {
  getUserRoomByID,
  getUserMessagesByID,
} from "../../../../store/entities/chat";
import {
  getSelectedRoomID,
  getChatOpenedAndVisible,
  getImageFromRoom,
  getShouldNavigateToChat,
} from "../../../../store/ui/Chat/chatSelectors";
import {
  setChatOpenedAndVisible,
  setShouldNavigateToChat,
} from "../../../../store/ui/Chat/chat";
import { getUserInfo } from "../../../../store/entities/profile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { ScreenNames } from "../../../../../ScreenNames";
import { AppImageViewer } from "../../../../Components/AppImageViewer/index";
import { getDeviceOrientation } from "../../../../store/ui/app";

export const AppbarChat = () => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // User's selected room ID
  const userSelectedRoomID = useSelector(getSelectedRoomID);
  // Reference to the user's selected room
  const userSelectedRoomIDRef = useRef(userSelectedRoomID);
  // Determines if a chat is opened and visible
  const ischatOpenedAndVisible = useSelector(getChatOpenedAndVisible);
  // User's selected room
  const userRoom = useSelector(getUserRoomByID(userSelectedRoomID));
  // The selected room's messages
  const userMessages = useSelector(getUserMessagesByID(userSelectedRoomID));
  // User's profile
  const userProfile = useSelector(getUserInfo);
  // Modal's visibility
  const [modalInfoVisible, setModaInfoVisible] = useState(false);
  // Reference to the modal's previous visibility
  const prevRefModalInfoVisible = useRef(modalInfoVisible);
  // App Navigation
  const navigation = useNavigation();
  // The image of the room
  const imageSource = useSelector(getImageFromRoom(userRoom));
  // The fallback image to display if the image of the room isn't available
  const fallbackImageSource = getRoomImage(userRoom, userProfile.ID);
  // Determines if the image viewer should display
  const [showImageViewer, setShowImageViewer] = useState(false);
  // Determines if the app should navigate directly to the chat screen
  const shouldNavigateToChat = useSelector(getShouldNavigateToChat);
  // Set timeout reference
  const timeoutRef = useRef(null);
  // The square dimensions of each image
  const [imageWidthHeightSize, setImageWidthHeightSize] = useState(0);
  // The maximum image square dimensions
  const minImageWidthHeightSize = 30;
  // The maximum image square dimensions
  const maxImageWidthHeightSize = 50;
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);

  // Determines if the chat is visible
  useEffect(() => {
    /**
     * Handles whether the user's chat is visible
     */
    // If the modal info was exited, the chat is visible again
    if (prevRefModalInfoVisible.current && !modalInfoVisible) {
      dispatch(setChatOpenedAndVisible(true));
    }
    // If the modal info was entered, the chat isn't visible
    else if (!prevRefModalInfoVisible.current && modalInfoVisible) {
      dispatch(setChatOpenedAndVisible(false));
    }

    /**
     * Handles whether or not the modal info should remain visible
     * or be dismissed
     */
    // If the user's selected room ID changes, the modal is dismissed
    if (userSelectedRoomID !== userSelectedRoomIDRef.current) {
      setModaInfoVisible(false);
    }

    // Updates the modal info visibile reference
    prevRefModalInfoVisible.current = modalInfoVisible;
    // Updates the user selected room ID reference
    userSelectedRoomIDRef.current = userSelectedRoomID;
  }, [modalInfoVisible, userSelectedRoomID]);

  useEffect(() => {
    // Sets the chat is visible and opened on first launch of this component
    dispatch(setChatOpenedAndVisible(true));

    // Calculates the dimensions of the room image
    setImageWidthHeightSize(Dimensions.get("window").width * 0.04);
  }, []);

  /**
   * Attempts to remove all notifications associated with the room whenever
   * a chat is visible
   */
  useEffect(() => {
    if (ischatOpenedAndVisible) removeNotificationsInTray(userSelectedRoomID);
  }, [ischatOpenedAndVisible]);

  /**
   * If the chat was opened by a notification, and the selected room's
   * data is not available, a timer is set for 10 seconds. If the room's
   * data isn't available, an alert is shown saying the user's chat data isn't
   * available and they're sent back to their list of chats
   */
  useEffect(() => {
    if (
      // If the user selected the room and the chat data is available
      (!shouldNavigateToChat && userMessages && userRoom) ||
      // If the chat was opened by a notification, and the chat data is available
      (shouldNavigateToChat && userMessages && userRoom)
    ) {
      /**
       * Resets the state that determines if the app should
       * navigate directly to the chat screen
       */
      dispatch(setShouldNavigateToChat(false));

      // Clears the set timeout of loading the user's messages if there is one
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      /**
       * Since the user's room's data isn't available, a timer starts
       * to allow the device to have 10 seconds to load the user's chat data
       */
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          // Alerts the user that their chat data failed to load
          Alert.alert(
            "Chat Data Unavailable",
            "It appears the chat's data didn't load on time, or failed to load. Please refresh" +
              " " +
              "your messages if it hasn't updated.",
            [
              {
                text: "Okay",
                onPress: () => {
                  // Exits out the chat
                  exitChat(dispatch, navigation);
                },
              },
            ]
          );
        }, 5000);
      }
    }
  }, [shouldNavigateToChat, userMessages, userRoom]);

  /**
   * Exits out of a chat
   * @param {*} dispatch Redux dispatch
   * @param {*} navigation React navigation
   */
  const exitChat = () => {
    // If there's a set timeout for loading the chat's data, it's cleared
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    /**
     * Resets the state that determines if the app should
     * navigate directly to the chat screen
     */
    dispatch(setShouldNavigateToChat(false));
    // Saves that a chat is no longer opened and visible
    dispatch(setChatOpenedAndVisible(false));
    // Navigates to the user's list of rooms
    navigation.navigate(ScreenNames.rooms);
  };

  return (
    <View style={styles.appBarContainer}>
      <View style={styles.navigationButton}>
        <Icon
          name="arrow-circle-left"
          type="font-awesome-5"
          color="white"
          size={minImageWidthHeightSize}
          onPress={() => exitChat()}
        />
      </View>
      <View style={styles.chatName}>
        {/* The room's image is only shown in portrait mode */}
        {screenOrientation === "portrait" && (
          <TouchableOpacity
            activeOpacity={0.75}
            title="Close Modal"
            onPress={() =>
              (imageSource && typeof imageSource === "object") ||
              (fallbackImageSource && typeof fallbackImageSource === "object")
                ? /**
                   * If the room has an image that's not the default, the image can be viewed.
                   * The image is not a default image if the image isn't a number but an object
                   */
                  setShowImageViewer(true)
                : null
            }
            disabled={!typeof imageSource === "object"}
            style={styles.imageButton}
          >
            {(imageSource || fallbackImageSource) && (
              <Image
                style={{
                  width: imageWidthHeightSize,
                  minWidth: minImageWidthHeightSize,
                  maxWidth: maxImageWidthHeightSize,
                  height: imageWidthHeightSize,
                  minHeight: minImageWidthHeightSize,
                  maxHeight: maxImageWidthHeightSize,
                }}
                source={imageSource ? imageSource : fallbackImageSource}
              />
            )}
          </TouchableOpacity>
        )}
        <Text style={styles.text} numberOfLines={1}>
          {userRoom && userProfile.ID
            ? getChatName(userRoom, userProfile.ID)
            : ""}
        </Text>
      </View>
      {userRoom && userProfile && (
        <View style={styles.options}>
          <Icon
            name="info"
            type="material"
            color="white"
            size={minImageWidthHeightSize}
            onPress={() => {
              // Saves that a chat is no longer opened and visible
              dispatch(setChatOpenedAndVisible(false));
              // Opens the modal
              setModaInfoVisible(true);
            }}
          />
        </View>
      )}

      {/* Chat information modal */}
      {userRoom && userProfile && (
        <ChatInfo visible={modalInfoVisible} setVisible={setModaInfoVisible} />
      )}

      {/* Image Viewer */}
      {(imageSource || fallbackImageSource) && (
        <AppImageViewer
          image={
            // Parses the image source's base64 string
            imageSource && imageSource.uri
              ? // If the room's image is available
                imageSource.uri.replace("data:image/gif;base64,", "")
              : fallbackImageSource && fallbackImageSource.uri
              ? // If the room image isn't available but the fallback image is
                fallbackImageSource.uri.replace("data:image/gif;base64,", "")
              : // If no image is available
                null
          }
          visible={showImageViewer}
          setVisible={setShowImageViewer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  navigationButton: { marginHorizontal: 10 },
  navigationButtonImage: {
    width: 32,
    height: 32,
    tintColor: "white",
  },
  chatName: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { paddingLeft: 10 },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  options: {
    marginHorizontal: 10,
  },
  imageButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "white",
    overflow: "hidden",
    borderRadius: 50,
    marginHorizontal: 10,
    marginVertical: 5,
  },
});
