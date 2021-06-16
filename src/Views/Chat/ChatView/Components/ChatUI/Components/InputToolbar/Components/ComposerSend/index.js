import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { getNewMessageID } from "../../../../../../../../../Services/Messages";

/**
 * Renders the Send button in the InputToolbar
 * @param {JSON} props Props passed from parent
 */
export const ComposerSend = (props) => {
  // The list of user selected image(s)
  let images = props.ImageHandler.selectedImages;

  // Determines if the send button is diabled (True if there's no text or selected images)
  const isSendDisabled = !props.text && images.length === 0;

  return (
    <TouchableOpacity
      style={[
        styles.mainContainer,
        {
          // Sets the opacity to indicate if the button is disabled
          opacity: isSendDisabled ? 0.4 : 1,
        },
      ]}
      disabled={isSendDisabled}
      onPress={() => {
        // Calls the onSend function given with the new message oobject
        props.onSend({
          _id: getNewMessageID(),
          text: props.text,
          createdAt: Date.now(),
          user: props.user,
          image: null,
          video: null,
          audio: null,
          system: false,
          sent: false,
          received: false,
          pending: false,
        });
        // Resets the text input
        props.onTextChanged("");
      }}
    >
      <Image
        style={{ width: 32, height: 32 }}
        source={require("./Images/send_button.png")}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#D0E7FF",
    marginHorizontal: 4,
    marginBottom: 2,
  },
});
