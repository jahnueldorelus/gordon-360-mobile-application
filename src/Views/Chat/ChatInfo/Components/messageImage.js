import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getImageContent } from "../../../../store/ui/Chat/chatSelectors";
import { getReadableDateFormat } from "../../../../Services/Messages/index";

export const MessageImage = (props) => {
  // The content of the image
  const imageSource = useSelector(getImageContent(props.image));
  // The minimum height and width of each message image
  const minImageWidthAndHeight = 200;
  // The width and height of each message image
  const imageWidthAndHeight = props.viewWidth
    ? Math.min(props.viewWidth, minImageWidthAndHeight)
    : minImageWidthAndHeight;

  return (
    <TouchableHighlight
      onPress={() => {
        // Sets the image to view
        props.setImageToView(imageSource);
        // Opens the image viewer
        props.setShowImageViewer(true);
      }}
      underlayColor="none"
      style={styles.imagesContainerImage}
    >
      <View>
        <Image
          source={{
            uri: "data:image/gif;base64," + imageSource,
          }}
          style={[
            styles.image,
            { width: imageWidthAndHeight, height: imageWidthAndHeight },
          ]}
        />
        <Text style={[styles.imageText, { maxWidth: imageWidthAndHeight }]}>
          {getReadableDateFormat(props.createdAt)}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  imagesContainerImage: {
    margin: 10,
    overflow: "hidden",
  },
  image: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3C6AA8",
  },
  imageText: {
    color: "#01335c",
    paddingHorizontal: 5,
    paddingVertical: 3,
    fontWeight: "600",
    alignSelf: "center",
    textAlign: "center",
  },
});

MessageImage.propTypes = {
  image: PropTypes.string.isRequired,
  viewWidth: PropTypes.number.isRequired,
  setImageToView: PropTypes.func.isRequired,
  setShowImageViewer: PropTypes.func.isRequired,
};
