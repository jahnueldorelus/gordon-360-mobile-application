import React, { useState, useEffect } from "react";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { GiftedChat } from "react-native-gifted-chat";
import {
  getMessages,
  getMainUser,
  getRooms,
} from "../../../Services/Messages/MessageService";
import { StyleSheet, View, Image, Dimensions } from "react-native";
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
    let roomObj = await getMessages(props.route.params.roomProp._id);
    let messages = roomObj.messages;
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

  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
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
