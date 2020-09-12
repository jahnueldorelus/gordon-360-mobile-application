/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { View, Text } from "react-native";
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
} from "react-native-gifted-chat";

export const renderAvatar = (props) => (
  <Avatar
    {...props}
    // containerStyle={{ left: { borderWidth: 3, borderColor: "red" }, right: {} }}
    // imageStyle={{ left: { borderWidth: 2, borderColor: "#014983" }, right: {} }}
  />
);

export const renderBubble = (props) => {
  /****** Just Seeing what's passed into props */
  delete props.forwardRef; // Deletes a lot of data so that the whole props object can be console logged
  console.log("Props:\n\n", props);
  /****** Just Seeing what's passed into props */

  return (
    <Bubble
      {...props}
      // renderTime={() => <Text>Time</Text>}
      // renderTicks={() => <Text>Ticks</Text>}
      containerStyle={{
        left: {},
        right: { borderColor: "white", borderWidth: 4 },
      }}
      // wrapperStyle={{
      //   left: { borderColor: "#31342B", borderWidth: 2 },
      //   right: {},
      // }}
      // bottomContainerStyle={{
      //   left: { borderColor: "black", borderWidth: 4 },
      //   right: {},
      // }}
      // tickStyle={{}}
      // usernameStyle={{ color: "black", fontWeight: "100" }}
      // containerToNextStyle={{
      //   left: { borderColor: "#31342B", borderWidth: 4 },
      //   right: {},
      // }}
      // containerToPreviousStyle={{
      //   left: { borderColor: "mediumorchid", borderWidth: 4 },
      //   right: {},
      // }}
    />
  );
};

export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: "#313428" }}
    wrapperStyle={{ borderWidth: 10, borderColor: "#313428" }}
    textStyle={{ color: "white", fontWeight: "900" }}
  />
);

export const renderMessage = (props) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: "white" },
      right: { backgroundColor: "white" },
    }}
  />
);

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    containerStyle={{
      left: { backgroundColor: "#31342B" },
      right: { backgroundColor: "black" },
    }}
    textStyle={{
      left: { color: "white" },
      right: { color: "white" },
    }}
    linkStyle={{
      left: { color: "#31342B" },
      right: { color: "gray" },
    }}
    customTextStyle={{ fontSize: 24, lineHeight: 16 }}
  />
);

export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 20, alignItems: "center" }}>
    <Text>{user.name}</Text>
  </View>
);
