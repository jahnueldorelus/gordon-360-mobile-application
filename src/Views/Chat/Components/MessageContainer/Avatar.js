import React from "react";
import { Avatar } from "react-native-gifted-chat";

/**
 * Renders the avatar of a user in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
export const renderAvatar = (props) => (
  <Avatar
    {...props}
    // containerStyle={{ left: { borderWidth: 3, borderColor: "red" }, right: {} }}
    // imageStyle={{ left: { borderWidth: 2, borderColor: "#014983" }, right: {} }}
  />
);
