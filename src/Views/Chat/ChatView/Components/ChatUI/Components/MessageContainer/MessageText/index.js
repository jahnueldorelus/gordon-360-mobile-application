import React from "react";
import { MessageText } from "react-native-gifted-chat";

/**
 * Displays the text that appears in a message bubble
 * @param {JSON} props Props passed from parent
 */
export const renderMessageText = (props) => (
  <MessageText
    {...props}
    linkStyle={{
      left: { color: "#31342B" },
      right: { color: "gray" },
    }}
    textStyle={{
      left: { color: "#31342B" },
      right: { color: "white" },
    }}
  />
);
