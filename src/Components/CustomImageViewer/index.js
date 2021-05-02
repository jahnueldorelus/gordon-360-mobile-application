import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Modal,
} from "react-native";
import * as FileSystem from "expo-file-system";

/**
 * Creates the Custom Image Viewer
 * @param {JSON} props Props passed from parent
 */
export const CustomImageViewer = (props) => {
  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  // The image
  const [imageURI, setImageURI] = useState(props.image);

  /**
   * If the image is a path to a local image, the image is retrieved
   * and converted to base64
   */
  useEffect(() => {
    const getBase64Format = async (image) => {
      // If the image is a path to the image on the local device, it's converted to base64
      if (image.includes("file:")) {
        const newImageURI =
          "data:image/gif;base64," +
          (await FileSystem.readAsStringAsync(image, {
            encoding: FileSystem.EncodingType.Base64,
          }));
        setImageURI(newImageURI);
      }
      // Since the image is not a file path, it's base64
      else {
        const newImageURI = "data:image/gif;base64," + image;
        setImageURI(newImageURI);
      }
    };

    getBase64Format(props.image);
  }, [props.image]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      maxWidth: (deviceWidth / 3) * 2, // Allows up to two-thirds of the screen
      height: deviceHeight / 4,
      borderRadius: 5,
    },
  });

  {
    /* *********************** END PAN FUNCTIONS ************************** */
  }

  return (
    <View style={styles.container}>
      {/* ****************************** HEADER ******************************* */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <View style={{ backgroundColor: "#014983" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              padding: 10,
              color: "white",
            }}
            onPress={() => {
              props.setVisible(false);
            }}
          >
            Header Options
          </Text>
        </View>
        {/* ****************************** IMAGE ******************************* */}
        <View
          style={{ flex: 1, backgroundColor: "white", overflow: "hidden" }}
        ></View>
        {/* *************************** FOOTER *********************************** */}
        <View style={{ backgroundColor: "#014983" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              padding: 10,
              color: "white",
            }}
          >
            Footer Options
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};
