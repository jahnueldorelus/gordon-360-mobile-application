import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { CustomImageViewer } from "../../../../../../Components/CustomImageViewer";

/**
 * Just a function that calls the real component MessageImage
 * @param {JSON} props Props passed from parent
 */
export const renderMessageImage = (
  props,
  setModalVisible,
  setModalContent,
  setModalContain,
  setModalCover,
  setModalHeight,
  setModalStyles
) => {
  return (
    <MessageImage
      {...props}
      setModalVisible={setModalVisible}
      setModalContent={setModalContent}
      setModalContain={setModalContain}
      setModalCover={setModalCover}
      setModalHeight={setModalHeight}
      setModalStyles={setModalStyles}
    />
  );
};

/**
 * Renders the message image in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
const MessageImage = (props) => {
  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  // The image viewer component
  const imageViewer = (
    <CustomImageViewer
      image={props.currentMessage.image}
      setVisible={props.setModalVisible}
    />
  );

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
          props.setModalContent(imageViewer);
          props.setModalContain(false);
          props.setModalCover(true);
          props.setModalHeight(100);
          props.setModalVisible(true);
          props.setModalStyles({});
        }}
      >
        <Image
          style={styles.image}
          source={{ uri: props.currentMessage.image }}
        />
      </TouchableOpacity>
    </View>
  );
};
