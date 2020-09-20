import React, { useState, useEffect } from "react";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { GiftedChat } from "react-native-gifted-chat";
import initialMessages from "./dummy_messages";
import { renderActions } from "./Components/InputToolBar/Actions";
import { renderAvatar } from "./Components/MessageContainer/Avatar";
import { renderBubble } from "./Components/MessageContainer/Bubble";
import { renderComposer } from "./Components/InputToolBar/Composer";
import { renderCustomView } from "./Components/MessageContainer/CustomView";
import { renderMessage } from "./Components/MessageContainer/Message";
import { renderMessageText } from "./Components/MessageContainer/MessageText";
import { renderSend } from "./Components/InputToolBar/Send";
import { renderSystemMessage } from "./Components/MessageContainer/SystemMessage";

const Chats = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(initialMessages.sort((a, b) => a.createdAt < b.createdAt));
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
      messagesContainerStyle={{ backgroundColor: "white" }}
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
        _id: 0,
        name: "Aaron",
        avatar: "https://placeimg.com/150/150/any",
      }}
    />
  );
};

export default Chats;
