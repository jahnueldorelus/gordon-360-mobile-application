import React from "react";
import { Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { getRoomImage } from "../../../Services/Messages";
import PropTypes from "prop-types";
import { getImageContent } from "../../../store/ui/chat";
import { getUserInfo } from "../../../store/entities/profile";

export const RoomImage = (props) => {
  // The user's profile info
  const userProfile = useSelector(getUserInfo);
  // The content of the image
  const imageSource = useSelector(getImageContent(props.room.image));

  return (
    <Image
      source={
        imageSource
          ? {
              uri: `data:image/gif;base64,${imageSource}`,
            }
          : getRoomImage(props.room, userProfile.ID)
      }
      style={styles.listItemImage}
    />
  );
};

const styles = StyleSheet.create({
  listItemImage: {
    borderColor: "#014983",
    width: 50,
    height: 50,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

RoomImage.propTypes = {
  room: PropTypes.object.isRequired,
};
