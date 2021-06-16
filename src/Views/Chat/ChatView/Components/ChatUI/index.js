import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import PropTypes from "prop-types";
import {
  sendMessage,
  parseChatObject,
} from "../../../../../store/entities/chat";
import { getSelectedRoomID } from "../../../../../store/ui/Chat/chatSelectors";
import { AppImageViewer } from "../../../../../Components/AppImageViewer";
import { renderAvatar } from "./Components/MessageContainer/Avatar";
import { renderBubble } from "./Components/MessageContainer/Bubble";
/**
 * Uncomment if you'd like to add a custom view to each message.
 */
// import { renderCustomView } from "./Components/MessageContainer/CustomView";
import { renderInputToolbar } from "./Components/InputToolbar";
import { renderMessage } from "./Components/MessageContainer/Message";
import { renderMessageImage } from "./Components/MessageContainer/MessageImage";
import { renderMessageText } from "./Components/MessageContainer/MessageText";
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
  let [selectedImages, setSelectedImages] = useState([]);
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
  // Reference to GiftedChat
  const giftedChatRef = useRef(null);

  /**
   *  GiftedChat's user format
   */
  const user = {
    _id: userProfile.ID,
    avatar: userImage,
    name: `${userProfile.FirstName} ${userProfile.LastName}`,
  };

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
   * Sends the user's message
   * @param {object} message The message object
   */
  const sendMessageAndImages = async (message) => {
    // Reformats the message object for the back-end to parse correctly
    const newMessage = parseChatObject(message);

    // The initial message date
    let messageDate = moment(newMessage.createdAt);

    // Gets the images associated with the room
    const parsedImages = selectedImages.map(async (image) => {
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
    setSelectedImages([]);
  };

  /**
   * Returns the input toolbar that functions with GiftedChat
   */
  const getInputToolbar = () => {
    // The props to pass to the input toolbar
    const inputToolbarProps = {
      onSend: props.onSend ? props.onSend : sendMessageAndImages,
      user,
      text: props.text ? props.text : text,
      onTextChanged: props.setText ? props.setText : setText,
      giftedChatRef,
      appbarHeight:
        typeof props.appbarHeight === "number" ? props.appbarHeight : null,
      fullMaxHeight: props.fullMaxHeight,
      addToolbarBottomPadding: props.addToolbarBottomPadding,
    };

    // Image Handler
    const ImageHandler = { selectedImages, setSelectedImages };
    // Image Viewer Handler
    const ImageToViewHandler = {
      setImage: setImageToView,
      openImageViewer: () => setShowImageViewer(true),
    };
    // Action Handler
    const ActionHandler = { showActions, setShowActions };
    // Camera Permissions Handler
    const CameraPermissionsHandler = {
      visible: showCamPermissSettings,
      setVisible: setShowCamPermissSettings,
    };

    // Returns the input toolbar
    return renderInputToolbar(
      inputToolbarProps,
      ImageHandler,
      ImageToViewHandler,
      ActionHandler,
      CameraPermissionsHandler
    );
  };

  return (
    <View style={styles.mainContainer}>
      <GiftedChat
        ref={giftedChatRef}
        {...props}
        alignTop
        minInputToolbarHeight={0}
        isCustomViewBottom
        isKeyboardInternallyHandled={false}
        messages={props.messages}
        messagesContainerStyle={styles.messagesContainer}
        parsePatterns={(linkStyle) => [
          {
            pattern: /#(\w+)/,
            style: linkStyle,
          },
        ]}
        renderAvatar={
          // The opposite user avatars will only display if the chat is a group
          props.selectedRoom.group ? (props) => renderAvatar(props) : null
        }
        renderBubble={(props) =>
          renderBubble({ ...props, currentRoom: props.selectedRoom })
        }
        renderComposer={() => null}
        /**
         * Uncomment if you'd like to add a custom view to each message.
         * This view appears after a message's text and before the message's
         * status information (aka date, sent, delivered, etc.)
         */
        // renderCustomView={renderCustomView}
        renderInputToolbar={() => null}
        renderMessage={renderMessage}
        renderMessageImage={(props) => {
          const ImageToViewHandler = {
            setImage: setImageToView,
            openImageViewer: () => setShowImageViewer(true),
          };

          return renderMessageImage(props, ImageToViewHandler);
        }}
        renderMessageText={renderMessageText}
        renderSend={() => null}
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

      {/* The Input Toolbar */}
      {getInputToolbar()}

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
  selectedImages: PropTypes.array,
  setSelectedImages: PropTypes.func,
  appbarHeight: PropTypes.number,
  fullMaxHeight: PropTypes.bool,
  addToolbarBottomPadding: PropTypes.bool,
};
