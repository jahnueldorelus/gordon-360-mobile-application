import React, { useState, useEffect } from "react";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { GiftedChat } from "react-native-gifted-chat";
import { getMessages } from "../../Services/Messages/MessageService";
import { StyleSheet } from "react-native";
import { renderActions } from "./Components/InputToolBar/Actions";
import { renderAvatar } from "./Components/MessageContainer/Avatar";
import { renderBubble } from "./Components/MessageContainer/Bubble";
import { renderComposer } from "./Components/InputToolBar/Composer";
import { renderCustomView } from "./Components/MessageContainer/CustomView";
import { renderMessage } from "./Components/MessageContainer/Message";
import { renderMessageText } from "./Components/MessageContainer/MessageText";
import { renderSend } from "./Components/InputToolBar/Send";
import { renderSystemMessage } from "./Components/MessageContainer/SystemMessage";

export const Chats = (props) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  /**
   * Gets the messages based upon the room ID and sorts them in order by date
   */
  useEffect(() => {
    let chat = getMessages(props.route.params.room_id).sort(
      (a, b) => a.createdAt < b.createdAt
    );
    if (chat.length > 0) setMessages(chat[0].messages);
    else {
      // This disables a chat room from being opened if the messages failed to load
      props.navigation.pop();
      props.navigation.navigate("Rooms", { error: "Failed to load messages" });
    }
  }, []);

  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  };

  return (
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
      // renderMessage={renderMessage}
      // renderMessageImage
      // renderMessageText={renderMessageText}
      renderSend={renderSend}
      renderSystemMessage={renderSystemMessage}
      scrollToBottom
      // showUserAvatar
      text={text}
      user={{
        _id: 5,
        name: "Aaron",
        avatar: "https://placeimg.com/140/140/any",
      }}
    />
  );
};

const styles = StyleSheet.create({
  messagesContainer: {
    backgroundColor: "white",
  },
});
