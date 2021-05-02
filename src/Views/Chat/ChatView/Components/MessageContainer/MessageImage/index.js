import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

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
  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  // The styles of this component
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      paddingTop: 10,
      marginBottom: 6,
    },
    image: {
      maxWidth: (deviceWidth / 3) * 2, // Allows up to two-thirds of the screen
      minWidth: 200, // The minimum width of an image
      height: deviceHeight / 4,
      borderRadius: 5,
      resizeMode: "contain",
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          // Saves the image to be shown
          props.ImageToViewHandler.setImage(props.currentMessage.image);
          // Opens the image viewer
          props.ImageToViewHandler.openImageViewer();
        }}
      >
        <Image
          style={styles.image}
          source={{
            uri: "data:image/gif;base64," + props.currentMessage.image,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
