import React, { useState } from "react";
import { Image, StyleSheet, TouchableHighlight } from "react-native";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getImageContent } from "../../../../store/ui/chat";

export const MessageImage = (props) => {
  // The content of the image
  const imageSource = useSelector(getImageContent(props.image));
  // The minimum height and width of each message image
  const [minImageWidthAndHeight, setMinImageWidthAndHeight] = useState(200);

  return (
    <TouchableHighlight
      onPress={() => {
        // Sets the image to view
        props.setImageToView(imageSource);
        // Opens the image viewer
        props.setShowImageViewer(true);
      }}
      underlayColor="none"
    >
      <Image
        source={{
          uri: "data:image/gif;base64," + imageSource,
        }}
        style={{
          ...styles.imagesContainerImage,
          width: props.viewWidth
            ? Math.min(props.viewWidth, minImageWidthAndHeight)
            : minImageWidthAndHeight,
          height: props.viewWidth
            ? Math.min(props.viewWidth, minImageWidthAndHeight)
            : minImageWidthAndHeight,
        }}
      />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  imagesContainerImage: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3C6AA8",
  },
});

MessageImage.propTypes = {
  image: PropTypes.string.isRequired,
  viewWidth: PropTypes.number.isRequired,
  setImageToView: PropTypes.func.isRequired,
  setShowImageViewer: PropTypes.func.isRequired,
};
