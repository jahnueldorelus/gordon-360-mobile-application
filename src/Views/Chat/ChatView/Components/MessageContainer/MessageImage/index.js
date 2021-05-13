import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { getImageContent } from "../../../../../../store/ui/chat";
import { useSelector } from "react-redux";

/**
 * Just a function that calls the real component MessageImage
 * @param {JSON} props Props passed from parent
 * @param {object} ImageToViewHandler Image viewer handler that handles what image should display
 */
export const renderMessageImage = (props, ImageToViewHandler) => {
  return <MessageImage {...props} ImageToViewHandler={ImageToViewHandler} />;
};

/**
 * Renders the message image in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
const MessageImage = (props) => {
  // The content of the image
  const imageSource = useSelector(getImageContent(props.currentMessage.image));

  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          // Saves the image to be shown
          props.ImageToViewHandler.setImage(imageSource);
          // Opens the image viewer
          props.ImageToViewHandler.openImageViewer();
        }}
      >
        <Image
          style={[
            styles.image,
            {
              maxWidth: (deviceWidth / 3) * 2, // Allows up to two-thirds of the screen
              height: deviceHeight / 4,
            },
          ]}
          source={{
            uri: "data:image/gif;base64," + imageSource,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

// The styles of this component
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 6,
  },
  image: {
    minWidth: 200, // The minimum width of an image
    borderRadius: 5,
    resizeMode: "contain",
  },
});
