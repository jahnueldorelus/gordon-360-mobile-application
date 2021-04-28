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
  getRoomImage,
  setRoomImage,
  getRoomName,
  setRoomName,
  setRoomID,
} from "../../../../../store/ui/chat";
import { ui_PeopleSearchResetState } from "../../../../../store/ui/peopleSearch";
import { ui_PeopleSearchFilterResetState } from "../../../../../store/ui/peopleSearchFilter";
import {
  createNewRoom,
  resetNewRoomCreated,
  getNewRoomCreated,
  getNewRoomCreatedID,
  getNewRoomCreatedLastUpdated,
  getCreateRoomLoading,
  correctedMessageObject,
  sendMessage,
} from "../../../../../store/entities/chat";
import { useDispatch, useSelector } from "react-redux";
import { GiftedChat } from "react-native-gifted-chat";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { renderActions } from "../../../ChatView/Components/InputToolbar/Components/Actions";
import { renderAvatar } from "../../../ChatView/Components/MessageContainer/Avatar";
import { renderBubble } from "../../../ChatView/Components/MessageContainer/Bubble";
import { renderComposer } from "../../../ChatView/Components/InputToolbar/Components/Composer";
import { renderInputToolbar } from "../../../ChatView/Components/InputToolbar";
import { renderMessage } from "../../../ChatView/Components/MessageContainer/Message";
import { renderMessageImage } from "../../../ChatView/Components/MessageContainer/MessageImage";
import { renderMessageText } from "../../../ChatView/Components/MessageContainer/MessageText";
import { renderSend } from "../../../ChatView/Components/InputToolbar/Components/Send";
import { renderSystemMessage } from "../../../ChatView/Components/MessageContainer/SystemMessage";
import {
  getUserInfo,
  getUserImage,
} from "../../../../../store/entities/profile";
import { RoomImagePicker } from "./RoomImagePicker/index";
import { useNavigation } from "@react-navigation/native";
import { Header } from "./Header/index.js";
import { GroupNameInput } from "./GroupNameInput/index";
import { CameraPermissions } from "./CameraPermissions/index";
import { LoadingScreen } from "../../../../../Components/LoadingScreen/index";
import { getNewMessageID } from "../../../../../Services/Messages/index";
import * as FileSystem from "expo-file-system";
import moment from "moment";

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
  const roomName = useSelector(getRoomName);

  // The room's image
  const roomImage = useSelector(getRoomImage);

  // The list of images the user has selected
  const [selectedImages, setSelectedImages] = useState(JSON.stringify([]));

  // Determines if the actions buttons of the input toolbar should display
  const [showActions, setShowActions] = useState(false);

  // Determines if a new room was created
  const newRoomCreated = useSelector(getNewRoomCreated);
  // The ID of the new room created
  const newRoomCreatedID = useSelector(getNewRoomCreatedID);
  // The last updated date of the new room created
  const newRoomCreatedLastUpdated = useSelector(getNewRoomCreatedLastUpdated);

  // Configuration for setting the custom modal
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    content: <></>,
    styles: {},
  });

  // The loading status of creating a room
  const createRoomLoading = useSelector(getCreateRoomLoading);
  // A reference to the loading status of creating a room
  const createRoomLoadingRef = useRef(createRoomLoading);

  // The user's profile
  const userProfile = useSelector(getUserInfo);

  // The user's image
  const userImage = useSelector(getUserImage);

  // GiftedChat's user format
  const mainUser = {
    _id: userProfile.ID,
    avatar: userImage,
    name: `${userProfile.FirstName} ${userProfile.LastName}`,
  };

  useEffect(() => {
    /**
     * If a new room was created, all temporary states are reset
     * and the user is navigated to the new room
     */
    if (createRoomLoadingRef.current && newRoomCreated) {
      // Saves the room as the selected room ID
      dispatch(setRoomID(newRoomCreatedID));
      // Sends the message to the server
      sendMessageToServer(previousMessage.current);
      // Delets the previous message
      previousMessage.current = null;
      // Deletes the user selected room image
      dispatch(setRoomImage(null));
      // Deletes the user selected room name
      dispatch(setRoomName(""));
      // Sets the value of new chat being created back to false
      dispatch(resetNewRoomCreated);
      // Exists out the new chat modal
      props.setNewChatModalVisible(false);
      // Deletes the last searched text
      props.setLastSearchedText(null);
      // Deletes selected users
      props.setSelectedUsers({});
      // Deletes people search results
      dispatch(ui_PeopleSearchResetState);
      // Deletes people search filters
      dispatch(ui_PeopleSearchFilterResetState);
      // Closes the modal to display the chat of the new room
      props.setVisible(false);
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
    if (props.selectedUsersList.length === 0) props.setVisible(false);
  }, [props.selectedUsersList]);

  /**
   * Sends the message to the server
   * @param {object} sentMessage The message to be sent to the server
   */
  const sendMessageToServer = async (sentMessage) => {
    // Reformats the message object for the back-end to parse correctly
    const newMessage = correctedMessageObject(sentMessage);

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
    // Saves the message's text to a reference since GiftedChat automatically erases it
    previousMessage.current = messageObj[0];
    // Gets the message object to send to the back-end
    const message = correctedMessageObject(messageObj[0]);

    /**
     * Deletes the user's avatar. This is due to privacy reasons as not every person
     * may have access to view this user's avatar. For example, if a student has their
     * image as private, other students shouldn't be able to see their avatar
     */
    message.user.avatar = null;

    // Formatted message for the back-end to parse
    const backEndMessage = {
      ...message,
      id: message._id,
    };

    // Creates a list of selected users
    const usernames = props.selectedUsersList.map((user) => user.AD_Username);
    // Adds the main user's username
    usernames.push(userProfile.AD_Username);

    // The room object to send to the back-end
    const room = {
      name: roomName.trim(),
      group: props.selectedUsersList.length > 1 ? true : false,
      image: roomImage,
      usernames,
      // TEMP - REMOVE MESSAGE PROPERTY IN FUTURE
      message: backEndMessage,
      userId: userProfile.ID,
    };

    // Sends the new room to the back-end
    dispatch(createNewRoom(room));
  };

  /**
   * Configures the minimum height of the input toolbar.
   * Do not delete or change the values below unless you change its
   * corresponding values in its respective components.
   * See documentation for bug "Text_Input"
   */
  const minInputToolbarHeight = () => {
    /**
     * Minimum height is 66. This height is required for the input toolbar to display
     * correctly without a spacing bug between the input toolbar and keyboard
     */
    let minHeight = 66;

    /**
     * If there are selected images, an added spacing of 161 is required to
     * display the images without a spacing bug between the input toolbar and keyboard.
     * The spacing required is 161 because each image has a height of 150 including
     * 11 for spacing.
     */
    if (JSON.parse(selectedImages).length > 0) minHeight += 161;

    /**
     * If the action buttons will be displayed, an added spacing of 45 is required to
     * display the buttons without a spacing bug between the input toolbar and keyboard.
     * The spacing required is 45 because each button has a height of 40 including 5
     * for spacing
     */
    if (showActions) minHeight += 45;

    return minHeight;
  };

  return (
    <Modal
      visible={props.visible}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={() => props.setVisible(false)}
      onDismiss={() => props.setVisible(false)}
    >
      <SafeAreaView style={styles.mainContainerSafeArea}>
        <View style={styles.mainContainerView}>
          {!createRoomLoading ? (
            // If a room is not in the process of being created
            <View style={{ flex: 1, backgroundColor: "white" }}>
              {/* Header */}
              <Header
                setVisible={props.setVisible}
                modalConfig={modalConfig}
                setModalConfig={setModalConfig}
              />

              {/* Group Name Input */}
              <GroupNameInput
                selectedUsersListLength={props.selectedUsersList.length}
              />

              {/* Room Image */}
              <RoomImagePicker
                modalConfig={modalConfig}
                setModalConfig={setModalConfig}
                selectedUsersListLength={props.selectedUsersList.length}
                setVisible={props.setVisible}
              />

              {/* Selected Users */}
              {props.selectedUsers}

              {/* GiftedChat */}
              <GiftedChat
                alignTop
                alwaysShowSend
                bottomOffset={getBottomSpace()}
                isCustomViewBottom
                messages={[]}
                messagesContainerStyle={styles.messagesContainer}
                minInputToolbarHeight={minInputToolbarHeight()}
                onInputTextChanged={setMessageText}
                onSend={createRoom}
                parsePatterns={(linkStyle) => [
                  {
                    pattern: /#(\w+)/,
                    style: linkStyle,
                  },
                ]}
                renderActions={(props) => {
                  const ImageHandler = { selectedImages, setSelectedImages };
                  const ModalHandler = { modalConfig, setModalConfig };
                  return renderActions(props, ImageHandler, ModalHandler);
                }}
                renderAvatar={renderAvatar}
                renderBubble={renderBubble}
                renderComposer={renderComposer}
                /**
                 * Uncomment if you'd like to add a custom view to each message.
                 * This view appears after a message's text and before the message's
                 * status information (aka date, sent, delivered, etc.)
                 */
                // renderCustomView={renderCustomView}
                renderInputToolbar={(props) => {
                  const ImageHandler = { selectedImages, setSelectedImages };
                  const ModalHandler = { modalConfig, setModalConfig };
                  const ActionHandler = { showActions, setShowActions };
                  return renderInputToolbar(
                    props,
                    ImageHandler,
                    ModalHandler,
                    ActionHandler
                  );
                }}
                renderMessage={renderMessage}
                renderMessageImage={(props) => {
                  const ModalHandler = { modalConfig, setModalConfig };
                  return renderMessageImage(props, ModalHandler);
                }}
                renderMessageText={renderMessageText}
                renderSend={renderSend}
                renderSystemMessage={renderSystemMessage}
                scrollToBottom
                text={messageText}
                user={mainUser}
              />

              {/* Camera Permissions */}
              <CameraPermissions modalConfig={modalConfig} />
            </View>
          ) : (
            // If a room is in the process of being created, a loading screen is shown
            <LoadingScreen loadingText="Creating New Chat" />
          )}
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
