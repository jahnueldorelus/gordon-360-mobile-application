import React from "react";
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
export const renderMessageImage = (props, ModalHandler) => {
  return <MessageImage {...props} ModalHandler={ModalHandler} />;
};

/**
 * Renders the message image in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
const MessageImage = (props) => {
  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  // Handles the visibility of the image viewer
  const handleImageVisibility = (isVisibile) => {
    let newModalConfig = { ...props.ModalHandler.modalConfig };
    newModalConfig.visible = isVisibile;
    props.ModalHandler.setModalConfig(newModalConfig);
  };

  // The image viewer component
  // const imageViewer = (
  //   <CustomImageViewer
  //     image={props.currentMessage.image}
  //     setVisible={handleImageVisibility}
  //   />
  // );

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
      // onPress={() => {
      //   // The new configuration for the modal
      //   let newModalConfig = { ...props.ModalHandler.modalConfig };
      //   /**
      //    * The modal's configuration is set to show the image in the image viewer
      //    */
      //   newModalConfig.visible = true;
      //   newModalConfig.content = imageViewer;
      //   newModalConfig.height = 100;
      //   newModalConfig.contain = false;
      //   newModalConfig.cover = true;
      //   newModalConfig.styles = {};
      //   props.ModalHandler.setModalConfig(newModalConfig);
      // }}
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
