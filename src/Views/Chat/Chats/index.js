import React, { useState, useEffect } from "react";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { GiftedChat } from "react-native-gifted-chat";
import {
  getMessages,
  getMainUser,
  sendMessage,
} from "../../../Services/Messages/MessageService";
import { StyleSheet, View } from "react-native";
import { renderActions } from "./Components/InputToolbar/Components/Actions";
import { renderAvatar } from "./Components/MessageContainer/Avatar";
import { renderBubble } from "./Components/MessageContainer/Bubble";
import { renderComposer } from "./Components/InputToolbar/Components/Composer";
import { renderCustomView } from "./Components/MessageContainer/CustomView";
import { renderInputToolbar } from "./Components/InputToolbar";
import { renderMessage } from "./Components/MessageContainer/Message";
import { renderMessageImage } from "./Components/MessageContainer/MessageImage";
import { renderMessageText } from "./Components/MessageContainer/MessageText";
import { renderSend } from "./Components/InputToolbar/Components/Send";
import { renderSystemMessage } from "./Components/MessageContainer/SystemMessage";
import { CustomModal } from "../../../Components/CustomModal";
import { AppBar } from "../../../Components/AppBar";
import AsyncStorage from "@react-native-community/async-storage";

export const Chats = (props) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  // Info for setting a custom modal for the image viewer
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(<></>);

  /**
   * Gets the messages based upon the room ID and sorts them in order by date
   * Also get the main user
   */
  useEffect(() => {
    getUser();
    getMessageData();
  }, []);

  /**
   * Gets the messages of the user
   */
  async function getMessageData() {
    let messages = await getMessages(props.route.params.roomProp._id);
    if (messages.length > 0) setMessages(messages);
    else {
      // This disables a chat room from being opened if the messages failed to load
      props.navigation.pop();
      props.navigation.navigate("Rooms", { error: "Failed to load messages" });
    }
  }

  /**
   * Gets the user from local storage
   */
  async function getUser() {
    await getMainUser().then((data) => {
      setUser(data);
    });
  }

  const onSend = async (text) => {
    // Shows the text message as pending until the database recevies the message
    text[0].pending = true;
    // Creates a copy of the  message list
    let oldMessageList = [...messages];
    // Adds the new text to the beginning of the list
    oldMessageList.splice(0, 0, text[0]);
    setMessages(oldMessageList);

    // Saves the message list to storage
    await AsyncStorage.setItem(
      `room:${props.route.params.roomProp._id}`,
      JSON.stringify(oldMessageList)
    );
    // Updates the rooms list to display the new last text message
    props.route.params.updateRooms(false); // False disables the function from fetching and saving the messages for each room
    // Sends the message to the database
    await sendMessage(text[0], props.route.params.roomProp._id)
      .then(async (wasSubmitted) => {
        // If the database received the message
        if (wasSubmitted) {
          // Since the database received the text, the message is no longer pending
          text[0].pending = false;
          let newMessageList = [...oldMessageList];
          // Replaces the original message that was pending with the new message that's not pending
          newMessageList.splice(0, 1, text[0]);
          setMessages(newMessageList);
          // Saves the message list to storage
          await AsyncStorage.setItem(
            `room:${props.route.params.roomProp._id}`,
            JSON.stringify(newMessageList)
          );
          // Updates the rooms list to display the new last text message
          props.route.params.updateRooms(false); // False disables the function from fetching and saving the messages for each room
        } else {
          /**
           * Since the database failed to save the message, let the user
           * know that sending the text failed and give them a chance to either
           * retry or cancel the text
           */
        }
      })
      // If the fetch fails
      .catch(() => {
        /**
         * Since adding the message to the database failed, let the user
         * know that sending the text failed and give them a chance to either
         * retry or cancel the text
         */
      });
  };

  if (messages && user && navigator)
    return (
      <View style={{ flex: 1 }}>
        <AppBar {...props} />
        <GiftedChat
          alignTop
          alwaysShowSend
          bottomOffset={getBottomSpace()}
          isCustomViewBottom
          messages={messages}
          messagesContainerStyle={styles.messagesContainer}
          /**
           * DO NOT DELETE THIS. THE MINIMUM INPUT TOOLBAR MUST BE SET TO 66.
           * SEE DOCUMENTATION FOR BUG "iOS_Text_Input"
           */
          minInputToolbarHeight={66}
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
          renderActions={renderActions}
          // renderAvatar={renderAvatar}
          renderBubble={renderBubble}
          renderComposer={renderComposer}
          // renderCustomView={renderCustomView}
          renderInputToolbar={renderInputToolbar}
          // renderMessage={renderMessage}
          renderMessageImage={(props) => {
            return renderMessageImage(props, setModalVisible, setModalContent);
          }}
          // renderMessageText={renderMessageText}
          renderSend={renderSend}
          renderSystemMessage={renderSystemMessage}
          scrollToBottom
          // showUserAvatar
          text={text}
          user={user}
        />

        <CustomModal
          content={modalContent}
          coverScreen
          height={100}
          visible={modalVisible}
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
