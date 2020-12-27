import React from "react";
import { SystemMessage } from "react-native-gifted-chat";

/**
 * Renders the system message in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: "#313428" }}
    wrapperStyle={{ borderWidth: 10, borderColor: "#313428" }}
    textStyle={{ color: "white", fontWeight: "900" }}
  />
);
