import React, { useEffect, useState } from "react";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { GiftedChat } from "react-native-gifted-chat";
import { getSelectedRoomID } from "../../../store/ui/chat";
import { getUserInfo, getUserImage } from "../../../store/entities/profile";
import {
  removeRoomIDFromNewMessages,
  getUserRoomsWithNewMessages,
  getUserMessagesByID,
  getUserRoomByID,
  sendMessage,
  correctedMessageObject,
} from "../../../store/entities/chat";
import * as Notifications from "expo-notifications";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View, LayoutAnimation } from "react-native";
import { renderActions } from "./Components/InputToolbar/Components/Actions";
import { renderAvatar } from "./Components/MessageContainer/Avatar";
import { renderBubble } from "./Components/MessageContainer/Bubble";
import { renderComposer } from "./Components/InputToolbar/Components/Composer";
/**
 * Uncomment if you'd like to add a custom view to each message.
 */
// import { renderCustomView } from "./Components/MessageContainer/CustomView";
import { renderInputToolbar } from "./Components/InputToolbar";
import { renderMessage } from "./Components/MessageContainer/Message";
import { renderMessageImage } from "./Components/MessageContainer/MessageImage";
import { renderMessageText } from "./Components/MessageContainer/MessageText";
import { renderSend } from "./Components/InputToolbar/Components/Send";
import { renderSystemMessage } from "./Components/MessageContainer/SystemMessage";
import { CustomModal } from "../../../Components/CustomModal";
import { AppBar } from "../../../Components/AppBar";
import * as FileSystem from "expo-file-system";
import { getNewMessageID } from "../../../Services/Messages/index";
import moment from "moment";

export const ChatView = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // The selected room's ID
  const roomID = useSelector(getSelectedRoomID);
  // User's selected room
  const currentRoom = useSelector(getUserRoomByID(roomID));
  // The selected room's messages
  const userMessages = useSelector(getUserMessagesByID(roomID));
  // The user's profile
  const userProfile = useSelector(getUserInfo);
  // The user's image
  const userImage = useSelector(getUserImage);
  // GiftedChat's user format
  const user = {
    _id: userProfile.ID,
    avatar: userImage,
    name: `${userProfile.FirstName} ${userProfile.LastName}`,
  };
  // The user's list of rooms with new messages
  const roomsWithNewMessages = useSelector(getUserRoomsWithNewMessages);

  // The current text inside the input toolbar
  const [text, setText] = useState("");
  // The list of images the user has selected
  const [selectedImages, setSelectedImages] = useState(JSON.stringify([]));
  // Determines if the actions buttons of the input toolbar should display
  const [showActions, setShowActions] = useState(false);
  // Configuration for setting the custom modal
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    content: <></>,
    height: 0,
    contain: null,
    cover: null,
    styles: {},
  });

  // Removes the room ID from the list of rooms with new unseen messages
  useEffect(() => {
    // Gets the notifications in the notification tray
    const getNotificationsTray = async () =>
      await Notifications.getPresentedNotificationsAsync();

    getNotificationsTray().then((notificationTray) => {
      /**
       * If the list of rooms with new messages includes this chat's room ID,
       * the room ID is removed from the list of rooms with new messages
       */
      if (roomsWithNewMessages.includes(roomID)) {
        dispatch(removeRoomIDFromNewMessages(roomID, notificationTray));
      }
    });
  }, [roomID, userMessages]);

  /**
   * Configures the animation for all components of GiftedChat so that
   * animation is smooth for all transitions
   */
  LayoutAnimation.easeInEaseOut();

  // Sends the user's message
  const onSend = async (text) => {
    // The message object
    const message = text[0];

    // Reformats the message object for the back-end to parse correctly
    const newMessage = correctedMessageObject(message);

    // The initial message date
    let messageDate = moment(newMessage.createdAt);

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
            room_id: roomID,
            text: "",
            createdAt: data.date,
            image: data.image,
          };
          // Image state message
          const imageStateMessage = {
            ...newMessage,
            _id: data.id,
            room_id: roomID,
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
      id: message._id,
      room_id: roomID,
      createdAt: newMessageDate,
    };

    // Formatted message for Redux to parse
    const stateMessage = {
      ...newMessage,
      _id: message._id,
      pending: true,
      createdAt: newMessageDate,
    };

    // Saves the message and sends it to the back-end
    dispatch(sendMessage(stateMessage, backEndMessage));
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

  // If the main user object and the main user's messages are available
  if (userMessages && user && currentRoom)
    return (
      <View style={{ flex: 1 }}>
        <AppBar {...props} />
        <GiftedChat
          alignTop
          alwaysShowSend
          bottomOffset={getBottomSpace()}
          isCustomViewBottom
          messages={userMessages}
          messagesContainerStyle={styles.messagesContainer}
          minInputToolbarHeight={minInputToolbarHeight()}
          onInputTextChanged={setText}
          onSend={onSend}
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
          renderAvatar={
            // The opposite user avatars will only display if the chat is a group
            currentRoom.group ? (props) => renderAvatar(props) : null
          }
          renderBubble={(props) => renderBubble({ ...props, currentRoom })}
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
          // showUserAvatar
          text={text}
          user={user}
        />

        <CustomModal
          content={modalConfig.content}
          coverScreen={modalConfig.cover}
          containInView={modalConfig.contain}
          height={modalConfig.height}
          visible={modalConfig.visible}
          styles={modalConfig.styles}
        />
      </View>
    );
  else return <></>;
};

const styles = StyleSheet.create({
  messagesContainer: {
    backgroundColor: "white",
  },
});
