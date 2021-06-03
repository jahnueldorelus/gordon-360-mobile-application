import React from "react";
import { Image, StyleSheet, View, Platform } from "react-native";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getImageFromRoom } from "../../../store/ui/Chat/chatSelectors";
import { getRoomImage } from "../../../Services/Messages";
import { getUserInfo } from "../../../store/entities/profile";
import { Dimensions } from "react-native";

export const RoomImage = (props) => {
  // User's profile
  const userProfile = useSelector(getUserInfo);
  // The content of the image
  const imageSource = useSelector(getImageFromRoom(props.room));
  // The fallback image to display if the image of the room isn't available
  const fallbackImageSource = getRoomImage(props.room, userProfile.ID);

  return (
    <View style={styles.imageContainer}>
      <Image
        source={imageSource ? imageSource : fallbackImageSource}
        style={
          Platform.OS === "ios"
            ? // Returns iOS image styling
              styles.iOSImage
            : // Returns Android image styling
              styles.androidImage
        }
      />
    </View>
  );
};

/**
 * The square dimensions of each image.
 * A size is determined by the width of the device and
 * the minimum size is 50.
 */
const imageWidthHeightSize =
  Dimensions.get("window").width * 0.08 > 50
    ? Dimensions.get("window").width * 0.08
    : 50;

const styles = StyleSheet.create({
  imageContainer: {
    borderColor: "#014983",
    borderWidth: 1,
    borderRadius: 50,
    overflow: "hidden",
  },
  androidImage: {
    width: imageWidthHeightSize,
    height: imageWidthHeightSize,
  },
  iOSImage: {
    width: imageWidthHeightSize,
    height: imageWidthHeightSize,
    borderRadius: 50,
  },
});

RoomImage.propTypes = {
  room: PropTypes.object.isRequired,
};
