import React, { useState, useEffect } from "react";
import { StyleSheet, View, LayoutAnimation } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { GiftedChat } from "react-native-gifted-chat";
import PropTypes from "prop-types";
import {
  sendMessage,
  parseChatObject,
} from "../../../../../store/entities/chat";
import { getSelectedRoomID } from "../../../../../store/ui/Chat/chatSelectors";
import { AppImageViewer } from "../../../../../Components/AppImageViewer";
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
import { CameraPermissionsDeviceSettings } from "../../../../../Components/CameraPermissionsDeviceSettings";
import {
  getUserInfo,
  getUserImage,
} from "../../../../../store/entities/profile";
import * as FileSystem from "expo-file-system";
import { getNewMessageID } from "../../../../../Services/Messages/index";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

export default ChatUI = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // The selected room's ID
  const roomID = useSelector(getSelectedRoomID);
  // The current text inside the input toolbar
  const [text, setText] = useState("");
  // The list of images the user has selected
  let [selectedImages, setSelectedImages] = useState(JSON.stringify([]));
  // If there are props set for the selected images, they are used instead of the state
  if (props.selectedImages && props.setSelectedImages) {
    selectedImages = props.selectedImages;
    setSelectedImages = props.setSelectedImages;
  }
  // Image to show in the image viewer
  const [imageToView, setImageToView] = useState(null);
  // Determines visibility of the image viewer
  const [showImageViewer, setShowImageViewer] = useState(false);
  // Determines if the actions buttons of the input toolbar should display
  const [showActions, setShowActions] = useState(false);
  // Determines if modal show displays asking the user to enable camera permissions in settings
  const [showCamPermissSettings, setShowCamPermissSettings] = useState(false);
  // The user's profile
  const userProfile = useSelector(getUserInfo);
  // The user's image
  const userImage = useSelector(getUserImage);

  /**
   *  GiftedChat's user format
   */
  const user = {
    _id: userProfile.ID,
    avatar: userImage,
    name: `${userProfile.FirstName} ${userProfile.LastName}`,
  };

  /**
   * Configures the animation for all components of GiftedChat so that
   * animation is smooth for all transitions
   */
  LayoutAnimation.easeInEaseOut();

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

  // Sends the user's message
  const sendMessageAndImages = async (text) => {
    // The message object
    const message = text[0];

    // Reformats the message object for the back-end to parse correctly
    const newMessage = parseChatObject(message);

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
        // Reads the image from the user's device
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

    /**
     * Sends the text message if there's text available.
     * This is to prevent messages with no text from being
     * sent to the server.
     */
    if (message.text) {
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
    }

    // Deletes the selected images
    setSelectedImages(JSON.stringify([]));
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
    <View style={styles.mainContainer}>
      <GiftedChat
        {...props}
        alignTop
        alwaysShowSend
        bottomOffset={getBottomSpace()}
        isCustomViewBottom
        messages={props.messages}
        messagesContainerStyle={styles.messagesContainer}
        minInputToolbarHeight={minInputToolbarHeight()}
        isKeyboardInternallyHandled={false}
        onInputTextChanged={props.setText ? props.setText : setText}
        onSend={props.onSend ? props.onSend : sendMessageAndImages}
        parsePatterns={(linkStyle) => [
          {
            pattern: /#(\w+)/,
            style: linkStyle,
          },
        ]}
        renderActions={(props) => {
          const ImageHandler = { selectedImages, setSelectedImages };
          const CameraPermissionsHandler = {
            visible: showCamPermissSettings,
            setVisible: setShowCamPermissSettings,
          };
          return renderActions(props, ImageHandler, CameraPermissionsHandler);
        }}
        renderAvatar={
          // The opposite user avatars will only display if the chat is a group
          props.selectedRoom.group ? (props) => renderAvatar(props) : null
        }
        renderBubble={(props) =>
          renderBubble({ ...props, currentRoom: props.selectedRoom })
        }
        renderComposer={renderComposer}
        /**
         * Uncomment if you'd like to add a custom view to each message.
         * This view appears after a message's text and before the message's
         * status information (aka date, sent, delivered, etc.)
         */
        // renderCustomView={renderCustomView}
        renderInputToolbar={(props) => {
          const ImageHandler = { selectedImages, setSelectedImages };
          const ImageToViewHandler = {
            setImage: setImageToView,
            openImageViewer: () => setShowImageViewer(true),
          };
          const ActionHandler = { showActions, setShowActions };

          return renderInputToolbar(
            props,
            ImageHandler,
            ImageToViewHandler,
            ActionHandler
          );
        }}
        renderMessage={renderMessage}
        renderMessageImage={(props) => {
          const ImageToViewHandler = {
            setImage: setImageToView,
            openImageViewer: () => setShowImageViewer(true),
          };

          return renderMessageImage(props, ImageToViewHandler);
        }}
        renderMessageText={renderMessageText}
        renderSend={renderSend}
        renderSystemMessage={renderSystemMessage}
        scrollToBottom
        // showUserAvatar
        text={props.text ? props.text : text}
        user={user}
        infiniteScroll={false}
        // onLoadEarlier={() => {
        //   console.log("Loading Earlier Messages");
        // }}
        // loadEarlier={true}
        // isLoadingEarlier={false}
      />

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
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "white" },
  messagesContainer: {
    backgroundColor: "white",
  },
});

ChatUI.propTypes = {
  messages: PropTypes.array.isRequired,
  onSend: PropTypes.func,
  selectedRoom: PropTypes.object.isRequired,
  text: PropTypes.string,
  setText: PropTypes.func,
  selectedImages: PropTypes.string,
  setSelectedImages: PropTypes.func,
  headerHeight: PropTypes.number.isRequired,
};
