import React from "react";
import { Image } from "react-native";
import { Send } from "react-native-gifted-chat";

/**
 * Renders the Send button in the InputToolbar
 * @param {JSON} props Props passed from parent
 */
export const renderSend = (props) => {
  // The list of user selected image(s)
  let images = JSON.parse(props.ImageHandler.selectedImages);

  // Determines if the send button is diabled (True if there's no text or selected images)
  const isSendDisabled = !props.text && images.length === 0;

  /**
   * If there's at least 1 selected image and no text, a temporary
   * text (a space) is set in order for the user to send
   * pictures since GiftedChat requires some text in order
   * for it to call its send function
   */
  if (images.length && !props.text) props.onTextChanged(" ");

  return (
    <Send
      {...props}
      disabled={isSendDisabled}
      containerStyle={{
        width: 36,
        height: 36,
        // Sets the opacity to indicate if the button is disabled
        opacity: isSendDisabled ? 0.4 : 1,
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
};
