import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  getImageContent,
  getSelectedRoomID,
} from "../../../../../../../../store/ui/Chat/chatSelectors";
import { getMessageImageByID } from "../../../../../../../../store/entities/chat";
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
  // The selected room's ID
  const roomID = useSelector(getSelectedRoomID);
  // The message's image (which should be it's image ID)
  const messageImage = useSelector(
    getMessageImageByID(roomID, props.currentMessage._id)
  );
  // The content of the image
  const imageSource = useSelector(getImageContent(messageImage));

  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.75}
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
