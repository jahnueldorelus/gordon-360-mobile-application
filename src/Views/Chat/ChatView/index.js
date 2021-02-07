import React, { useState } from "react";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { GiftedChat } from "react-native-gifted-chat";
import { sendMessage } from "../../../Services/Messages";
import { getSelectedRoomID } from "../../../store/ui/chat";
import { getUserInfo, getUserImage } from "../../../store/entities/profile";
import { getUserMessagesByID } from "../../../store/entities/chat";
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
import AsyncStorage from "@react-native-community/async-storage";

export const ChatView = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // The selected room's ID
  const roomID = useSelector(getSelectedRoomID);
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

  // The current text inside the input toolbar
  const [text, setText] = useState("");
  // The list of messages for the chat
  const [messages, setMessages] = useState([]);
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

  /**
   * Configures the animation for all components of GiftedChat so that
   * animation is smooth for all transitions
   */
  LayoutAnimation.easeInEaseOut();

  const onSend = async (text) => {
    // // Adds the selected image to the text
    // text[0].image = selectedImages; // COME BACK AND EDIT THIS TO BE ABLE TO SEND IMAGES
    // // Shows the text message as pending until the database recevies the message
    // text[0].pending = true;
    // // Creates a copy of the message list
    // let oldMessageList = [...messages];
    // // Adds the new text to the beginning of the list
    // oldMessageList.splice(0, 0, text[0]);
    // setMessages(oldMessageList);
    // // Saves the message list to storage
    // await AsyncStorage.setItem(
    //   `room:${props.route.params.roomProp._id}`,
    //   JSON.stringify(oldMessageList)
    // );
    // // Updates the rooms list to display the new last text message
    // props.route.params.updateRooms(false); // False disables the function from fetching and saving the messages for each room
    // // Sends the message to the database
    // await sendMessage(text[0], props.route.params.roomProp._id)
    //   .then(async (wasSubmitted) => {
    //     // If the database received the message
    //     if (wasSubmitted) {
    //       // Since the database received the text, the message is no longer pending
    //       text[0].pending = false;
    //       let newMessageList = [...oldMessageList];
    //       // Replaces the original message that was pending with the new message that's not pending
    //       newMessageList.splice(0, 1, text[0]);
    //       setMessages(newMessageList);
    //       // Saves the message list to storage
    //       await AsyncStorage.setItem(
    //         `room:${props.route.params.roomProp._id}`,
    //         JSON.stringify(newMessageList)
    //       );
    //       // Updates the rooms list to display the new last text message
    //       props.route.params.updateRooms(false); // False disables the function from fetching and saving the messages for each room
    //     } else {
    //       /**
    //        * Since the database failed to save the message, let the user
    //        * know that sending the text failed and give them a chance to either
    //        * retry or cancel the text
    //        */
    //     }
    //   })
    //   // If the fetch fails
    //   .catch(() => {
    //     /**
    //      * Since adding the message to the database failed, let the user
    //      * know that sending the text failed and give them a chance to either
    //      * retry or cancel the text
    //      */
    //   });
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

  // if (messages && user)
  if (userMessages)
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
          // onPressAvatar={console.log}
          onSend={onSend}
          parsePatterns={(linkStyle) => [
            {
              pattern: /#(\w+)/,
              style: linkStyle,
              onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
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
