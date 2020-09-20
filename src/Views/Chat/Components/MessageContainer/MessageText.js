import React from "react";
import { MessageText } from "react-native-gifted-chat";

/**
 * Displays the text that appears in a message bubble
 * @param {JSON} props Props passed from parent
 */
export const renderMessageText = (props) => (
  <MessageText
    {...props}
    containerStyle={{
      left: { backgroundColor: "#31342B", borderWidth: 1 },
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
