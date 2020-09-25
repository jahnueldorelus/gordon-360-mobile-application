import React from "react";
import { Image } from "react-native";
import { Send } from "react-native-gifted-chat";

/**
 * Renders the Send button in the InputToolbar
 * @param {JSON} props Props passed from parent
 */
export const renderSend = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
      borderRadius: 20,
      backgroundColor: "#D0E7FF",
      marginRight: 4,
    }}
  >
    <Image
      style={{ width: 32, height: 32 }}
      source={require("./Images/send_button.png")}
    />
  </Send>
);
