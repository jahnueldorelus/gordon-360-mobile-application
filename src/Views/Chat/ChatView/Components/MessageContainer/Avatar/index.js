import React from "react";
import { Image, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

/**
 * Renders the avatar of a user in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
export const renderAvatar = (props) =>
  props.currentMessage.user.avatar &&
  typeof props.currentMessage.user.avatar === "string" ? (
    // If the message has an image and the image is a string (aka base64)
    <Image
      style={styles.userAvatar}
      source={{ uri: props.currentMessage.user.avatar }}
    />
  ) : (
    // Since there's no image, a default image is supplied instead
    <Icon
      name={"user-circle-o"}
      type="font-awesome"
      color="#014983"
      solid={true}
      size={avatarSize}
    />
  );

// The size of the avatar
const avatarSize = 36;

// The styles of the component
const styles = StyleSheet.create({
  userAvatar: {
    alignSelf: "center",
    justifyContent: "center",
    width: avatarSize,
    height: avatarSize,
    borderRadius: 50,
    borderWidth: 0.2,
    borderColor: "#014983",
  },
});
