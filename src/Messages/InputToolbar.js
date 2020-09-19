/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Image } from "react-native";
import { InputToolbar, Actions, Send } from "react-native-gifted-chat";
import Composer from "./Composer";

export const renderInputToolbar = (props) => (
  /**
   * Do not delete the vertical padding. This fills the gap between the Input
   * Toolbar and the keyboard that appears on the screen. See documentation
   * for bug "iOS_Text_Input"
   */
  <InputToolbar {...props} containerStyle={{ paddingVertical: 11 }} />
);

export const renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Image
        style={{ width: 32, height: 32 }}
        source={{
          uri: "https://placeimg.com/32/32/any",
        }}
      />
    )}
    options={{
      "Choose From Library": () => {
        console.log("Choose From Library");
      },
      Cancel: () => {
        console.log("Cancel");
      },
    }}
    optionTintColor="#222B45"
  />
);

export const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: "#222B45",
      backgroundColor: "#EDF1F7",
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#E4E9F2",
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

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
      source={require("./send_button.png")}
    />
  </Send>
);
