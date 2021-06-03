import React from "react";
import { Message } from "react-native-gifted-chat";

/**
 * This is the full container of a single text message. This includes
 * both the text message bubble and the user avatar if present
 * @param {JSON} props Props passed from parent
 */
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
