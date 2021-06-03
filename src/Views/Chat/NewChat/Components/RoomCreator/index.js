import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import {
  getNewRoomImage,
  getNewRoomName,
} from "../../../../../store/ui/Chat/chatSelectors";
import {
  setNewRoomImage,
  setNewRoomName,
  setRoomID,
} from "../../../../../store/ui/Chat/chat";
import {
  ui_PeopleSearchResetState,
  getSearchResultImages,
} from "../../../../../store/ui/peopleSearch";
import { ui_PeopleSearchFilterResetState } from "../../../../../store/ui/peopleSearchFilter";
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
import { useNavigation } from "@react-navigation/native";
import { Header } from "./Header/index.js";
import { GroupNameInput } from "./GroupNameInput/index";
import { CameraPermissionsDeviceSettings } from "../../../../../Components/CameraPermissionsDeviceSettings/index";
import { LoadingScreen } from "../../../../../Components/LoadingScreen/index";
import { getNewMessageID } from "../../../../../Services/Messages/index";
import * as FileSystem from "expo-file-system";
import { AppImageViewer } from "../../../../../Components/AppImageViewer/";
import moment from "moment";
import { getDeviceOrientation } from "../../../../../store/ui/app";

export const RoomCreator = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // React Native Navigation
  const navigation = useNavigation();
  // The current text inside the input toolbar
  const [messageText, setMessageText] = useState(null);
  // A reference to the current text inside the input toolbar
  const previousMessage = useRef(messageText);
  // The room's name
  const roomName = useSelector(getNewRoomName);
  // The room's image
  const roomImage = useSelector(getNewRoomImage);
  // Image to show in the image viewer
  const [imageToView, setImageToView] = useState(roomImage);
  // The list of images the user has selected
  const [selectedImages, setSelectedImages] = useState(JSON.stringify([]));
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
      // Delets the previous message
      previousMessage.current = null;
      // Deletes the user selected room image
      dispatch(setNewRoomImage(null));
      // Deletes the user selected room name
      dispatch(setNewRoomName(""));
      // Sets the value of new chat being created back to false
      dispatch(resetNewRoomCreated());
      // Exists out the new chat modal
      props.data.setNewChatModalVisible(false);
      // Deletes the last searched text
      props.data.setLastSearchedText(null);
      // Deletes selected users
      props.data.setSelectedUsers({});
      // Deletes people search results
      dispatch(ui_PeopleSearchResetState());
      // Deletes people search filters
      dispatch(ui_PeopleSearchFilterResetState);
      // Closes the modal to display the chat of the new room
      props.data.setVisible(false);
      // Navigates to the chat screen
      navigation.navigate("Chat");
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
    // If there are no selected users, the modal is exited
    if (props.data.selectedUsersList.length === 0) props.data.setVisible(false);
  }, [props.data.selectedUsersList]);

  /**
   * If an image is set to be shown, the image viewer will open. Otherwise,
   * the image viewer will be closed (if opened) and the image to be shown
   * will be reset
   */
  useEffect(() => {
    if (imageToView) {
      setShowImageViewer(true);
    } else {
      setShowImageViewer(false);
      setImageToView(null);
    }
  }, [imageToView]);

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
    const parsedImages = JSON.parse(selectedImages).map(async (image) => {
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
    const message = parseChatObject(messageObj[0]);

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
      <SafeAreaView style={styles.mainContainerSafeArea}>
        <View style={styles.mainContainerView}>
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
              <View style={styles.roomCreationViewInfo}>
                {/* Header */}
                <Header setVisible={props.data.setVisible} />

                {/* Group Name Input */}
                <GroupNameInput
                  selectedUsersListLength={props.data.selectedUsersList.length}
                />

                {/* Room Image */}
                <RoomImagePicker
                  setShowCamPermissSettings={setShowCamPermissSettings}
                  selectedUsersListLength={props.data.selectedUsersList.length}
                  setVisible={props.data.setVisible}
                />

                {/* Selected Users */}
                {props.data.selectedUsers}
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
            image={imageToView}
            visible={showImageViewer}
            setVisible={setShowImageViewer}
          />
        </View>
      </SafeAreaView>
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
    flex: 1,
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
