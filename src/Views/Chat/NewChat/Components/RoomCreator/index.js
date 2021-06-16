import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import {
  getNewRoomImage,
  getNewRoomName,
} from "../../../../../store/ui/Chat/chatSelectors";
import { setRoomID } from "../../../../../store/ui/Chat/chat";
import { getSearchResultImages } from "../../../../../store/ui/peopleSearch";
import {
  createNewRoom,
  resetNewRoomCreated,
  getNewRoomCreated,
  getNewRoomCreatedID,
  getNewRoomCreatedLastUpdated,
  getCreateRoomLoading,
  parseChatObject,
  sendMessage,
  saveUserImagesList,
} from "../../../../../store/entities/chat";
import { useDispatch, useSelector } from "react-redux";
import ChatUI from "../../../ChatView/Components/ChatUI/index";
import { getUserInfo } from "../../../../../store/entities/profile";
import { RoomImagePicker } from "./RoomImagePicker/index";
import { Header } from "./Header/index.js";
import { GroupNameInput } from "./GroupNameInput/index";
import { CameraPermissionsDeviceSettings } from "../../../../../Components/CameraPermissionsDeviceSettings/index";
import { LoadingScreen } from "../../../../../Components/LoadingScreen/index";
import { getNewMessageID } from "../../../../../Services/Messages/index";
import * as FileSystem from "expo-file-system";
import { AppImageViewer } from "../../../../../Components/AppImageViewer/";
import moment from "moment";
import {
  getDeviceOrientation,
  getKeyboardHeight,
} from "../../../../../store/ui/app";
import { getBottomSpace } from "react-native-iphone-x-helper";

export const RoomCreator = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // The current text inside the input toolbar
  const [messageText, setMessageText] = useState(null);
  // A reference to the current text inside the input toolbar
  const previousMessage = useRef(messageText);
  // The room's name
  const roomName = useSelector(getNewRoomName);
  // The room's image
  const roomImage = useSelector(getNewRoomImage);
  // The list of images the user has selected
  const [selectedImages, setSelectedImages] = useState([]);
  /**
   * The height difference between the start of the device's screen
   * and the top of the modal. This is for iOS devices where the modal
   * doesn't cover the entire screen
   */
  const [extraModalHeight, setExtraModalHeight] = useState(0);
  // The height of the modal's content apart from GiftedChat
  const [contentHeight, setContentHeight] = useState(0);
  // Determines if a new room was created
  const newRoomCreated = useSelector(getNewRoomCreated);
  // The ID of the new room created
  const newRoomCreatedID = useSelector(getNewRoomCreatedID);
  // The last updated date of the new room created
  const newRoomCreatedLastUpdated = useSelector(getNewRoomCreatedLastUpdated);
  // The object of the search result's people's images
  const searchResultImages = useSelector(getSearchResultImages);
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);
  // The keyboard's height
  const keyboardHeight = useSelector(getKeyboardHeight);

  // Determines if modal show displays asking the user to enable camera permissions in settings
  const [showCamPermissSettings, setShowCamPermissSettings] = useState(false);
  // Determines visibility of the image viewer
  const [showImageViewer, setShowImageViewer] = useState(false);

  // The loading status of creating a room
  const createRoomLoading = useSelector(getCreateRoomLoading);
  // A reference to the loading status of creating a room
  const createRoomLoadingRef = useRef(createRoomLoading);

  // The user's profile
  const userProfile = useSelector(getUserInfo);

  useEffect(() => {
    /**
     * If a new room was created, the images of the users in the new room
     * are saved, all temporary states are reset,
     * and the user is navigated to the new room
     */
    if (createRoomLoadingRef.current && newRoomCreated) {
      // Saves the images of the users in the new room
      dispatch(
        saveUserImagesList(
          props.data.selectedUsersList.map((user) => ({
            pref: searchResultImages[user.AD_Username],
            username: user.AD_Username,
          }))
        )
      );
      // Saves the room as the selected room ID
      dispatch(setRoomID(newRoomCreatedID));
      // Sends the message to the server
      sendMessageToServer(previousMessage.current);
      // Deletes the previous message
      previousMessage.current = null;
      // Sets the value of new chat being created back to false
      dispatch(resetNewRoomCreated());
      // Exists out all create new chat modals and navigates to the chat screen
      props.data.exitModalAndGoToChat();
    }
    // Creating a new room failed
    else if (createRoomLoadingRef.current && !newRoomCreated) {
      Alert.alert(
        "Unsuccessful Chat Creation",
        "An error occured while creating a new chat. Please try again."
      );
    }

    // Saves the newest state for the loading status of creating a new room into the ref
    createRoomLoadingRef.current = createRoomLoading;
  }, [newRoomCreated, createRoomLoading]);

  useEffect(() => {
    // If the modal is visible
    if (props.data.visible) {
      // If there are no selected users, the modal is exited
      if (props.data.selectedUsersList.length === 0)
        props.data.setVisible(false);

      /**
       * If the duplicated room ID exists, then an alert is shown
       * to the user showing that a duplicate room exists
       */
      if (props.data.chatExists()) {
        Alert.alert("Existent Chat", props.data.duplicateChatMessage(false), [
          {
            text: "Go Back",
            onPress: () => {
              // Exists out the modal
              props.data.setVisible(false);
            },
          },
        ]);
      }
    }
  }, [props.data.selectedUsersList]);

  /**
   * Sends the message to the server
   * @param {object} sentMessage The message to be sent to the server
   */
  const sendMessageToServer = async (sentMessage) => {
    // Reformats the message object for the back-end to parse correctly
    const newMessage = parseChatObject(sentMessage);

    // The initial message date is the last updated date of the new room
    let messageDate = moment(newRoomCreatedLastUpdated);

    // Gets the images associated with the room
    const parsedImages = selectedImages.map(async (image) => {
      // Creates a new date for the message based upon index to seperate each image by time
      messageDate.add(1, "milliseconds");

      return {
        date: messageDate.format("YYYY-MM-DDTHH:mm:ss.SSS"),
        // ID is created similar to the format of GiftedChat
        id: getNewMessageID(),
        image: await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        }),
      };
    });

    // If there are selected images, each image is sent to the back-end
    if (parsedImages.length > 0) {
      // Parses through the list of images of creates a new message for each
      parsedImages.forEach((imageData) => {
        imageData.then((data) => {
          // Image back-end message
          const imageBackEndMessage = {
            ...newMessage,
            id: data.id,
            room_id: newRoomCreatedID,
            text: "",
            createdAt: data.date,
            image: data.image,
          };
          // Image state message
          const imageStateMessage = {
            ...newMessage,
            _id: data.id,
            room_id: newRoomCreatedID,
            text: "",
            createdAt: data.date,
            image: data.image,
            pending: true,
          };

          // Saves the message and sends it to the back-end
          dispatch(sendMessage(imageStateMessage, imageBackEndMessage));
        });
      });

      /**
       * Since there are selected images, the message date is forwarded to prevent
       * the actual text message that will be sent down below from having the same
       * exact time as any of the selected pictures.
       */
      messageDate.add(1, "milliseconds");
    }

    const newMessageDate = messageDate.format("YYYY-MM-DDTHH:mm:ss.SSS");

    // Formatted message for the back-end to parse
    const backEndMessage = {
      ...newMessage,
      id: sentMessage._id,
      room_id: newRoomCreatedID,
      createdAt: newMessageDate,
    };

    // Formatted message for Redux to parse
    const stateMessage = {
      ...newMessage,
      _id: sentMessage._id,
      pending: true,
      createdAt: newMessageDate,
    };

    // Saves the message and sends it to the back-end
    dispatch(sendMessage(stateMessage, backEndMessage));
  };

  /**
   * Creates the new room
   * @param {object} messageObj The message object
   */
  const createRoom = async (messageObj) => {
    // Reformats the message object for the back-end to parse correctly
    const message = parseChatObject(messageObj);

    // Saves the message's text to a reference since GiftedChat automatically erases it
    previousMessage.current = message;

    /**
     * Deletes the user's avatar. This is due to privacy reasons as not every person
     * may have access to view this user's avatar. For example, if a student has their
     * image as private, other students shouldn't be able to see their avatar
     */
    message.user.avatar = null;

    // Formatted message for the back-end to parse
    const backEndMessage = {
      ...message,
    };

    // Creates a list of selected users
    const usernames = props.data.selectedUsersList.map(
      (user) => user.AD_Username
    );
    // Adds the main user's username
    usernames.push(userProfile.AD_Username);

    // The room object to send to the back-end
    const room = {
      name: roomName.trim(),
      group: props.data.selectedUsersList.length > 1 ? true : false,
      image: roomImage,
      usernames,
      // TEMP - REMOVE MESSAGE PROPERTY IN FUTURE
      message: backEndMessage,
      userId: userProfile.ID,
    };

    // Sends the new room to the back-end
    dispatch(createNewRoom(room));
  };

  return (
    <Modal
      visible={props.data.visible}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={() => props.data.setVisible(false)}
      onDismiss={() => props.data.setVisible(false)}
    >
      <View
        onLayout={(e) => {
          setExtraModalHeight(
            Dimensions.get("window").height - e.nativeEvent.layout.height
          );
        }}
        style={styles.mainContainerView}
      >
        {!createRoomLoading ? (
          // If a room is not in the process of being created
          <View
            style={[
              styles.roomCreationView,
              {
                // Determines if the view should appear in portrait or landscape mode
                flexDirection:
                  screenOrientation === "landscape" ? "row" : "column",
              },
            ]}
          >
            <View
              onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
              style={[
                styles.roomCreationViewInfo,
                {
                  // Sets the maximum width in landscape mode to half of the screen
                  maxWidth:
                    screenOrientation === "landscape"
                      ? Dimensions.get("window").width / 2
                      : Dimensions.get("window").width,
                  // Sets the maximum height of the view
                  maxHeight:
                    screenOrientation === "landscape" && keyboardHeight > 0
                      ? // If in landscape mode and the keyboard is visible
                        Dimensions.get("window").height -
                        keyboardHeight +
                        getBottomSpace()
                      : // If the keyboard isn't visible and is in landscape or portrait mode
                        "auto",
                },
              ]}
            >
              {/* Header */}
              <Header setVisible={props.data.setVisible} />

              <ScrollView keyboardShouldPersistTaps="always">
                {/* Group Name Input */}
                <GroupNameInput
                  selectedUsersListLength={props.data.selectedUsersList.length}
                />

                {/* Room Image */}
                <RoomImagePicker
                  setShowCamPermissSettings={setShowCamPermissSettings}
                  selectedUsersListLength={props.data.selectedUsersList.length}
                  setVisible={props.data.setVisible}
                  setShowImageViewer={setShowImageViewer}
                />

                {/* Selected Users */}
                {props.data.selectedUsers}
              </ScrollView>
            </View>

            {/* GiftedChat */}
            <ChatUI
              onSend={createRoom}
              messages={[]}
              selectedRoom={{}}
              text={messageText}
              setText={setMessageText}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              appbarHeight={
                screenOrientation === "landscape"
                  ? 0
                  : contentHeight + extraModalHeight
              }
              fullMaxHeight={true}
              addToolbarBottomPadding={true}
            />
          </View>
        ) : (
          // If a room is in the process of being created, a loading screen is shown
          <LoadingScreen loadingText="Creating New Chat" />
        )}

        {/* Camera Permissions */}
        <CameraPermissionsDeviceSettings
          visible={showCamPermissSettings}
          setVisible={setShowCamPermissSettings}
        />

        {/* Image Viewer */}
        <AppImageViewer
          image={roomImage}
          visible={showImageViewer}
          setVisible={setShowImageViewer}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainerSafeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  mainContainerView: {
    justifyContent: "center",
    backgroundColor: "white",
    flex: 1,
  },
  roomCreationView: { flex: 1, backgroundColor: "white" },
  roomCreationViewInfo: {
    borderRightColor: "black",
    borderRightWidth: 1,
  },
  messagesContainer: {
    backgroundColor: "white",
  },
  loadingImage: {
    resizeMode: "contain",
    width: "50%",
    height: "50%",
  },
  loadingText: {
    color: "#014983",
    marginTop: "10%",
    fontSize: Dimensions.get("window").width * 0.1,
  },
});
