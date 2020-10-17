import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

/**
 * Renders the message's Image in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
export const renderMessageImage = (props) => {
  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const styles = StyleSheet.create({
    imageContainer: { paddingHorizontal: 10, paddingTop: 10, marginBottom: 6 },
    image: {
      maxWidth: (deviceWidth / 3) * 2, // Allows up to two-thirds of the screen
      height: deviceHeight / 4,
      borderRadius: 10,
    },
  });

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: props.currentMessage.image }}
        style={styles.image}
      />
    </View>
  );
};
