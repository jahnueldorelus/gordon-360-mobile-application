import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Modal,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import { getImage } from "../../Services/Messages";
import { Icon } from "react-native-elements";
import * as FileSystem from "expo-file-system";
import PropTypes from "prop-types";

/**
 * Creates the Custom Image Viewer
 * @param {JSON} props Props passed from parent
 */
export const AppImageViewer = (props) => {
  // The image
  const [imageURI, setImageURI] = useState(props.image);

  /**
   * If the image is a path to a local image, the image is retrieved
   * and converted to base64
   */
  useEffect(() => {
    /**
     * Gets the base64 format of an image
     * @param {string} image The image in "file://" or base64 format
     */
    const getBase64Format = async (image) => {
      // Checks to make sure an image is existent
      if (image) {
        // If the image is an array of base64 content
        if (Array.isArray(image)) {
          const newImageURI = "data:image/gif;base64," + getImage(image);
          setImageURI(newImageURI);
        }
        // If the image is a path to the image on the local device, it's converted to base64
        else if (image.includes("file:")) {
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
      }
    };
    getBase64Format(props.image);
  }, [props.image]);

  /**
   * Shares the image given to this component
   */
  const shareImage = async () => {
    Share.share({
      url: imageURI,
      type: "image/png",
      filename: "image.png",
    });
  };

  return (
    <Modal
      visible={props.visible}
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <View style={styles.container}>
        {/* ****************************** HEADER ******************************* */}
        <SafeAreaView style={styles.safeAreaView}>
          <View
            style={{
              backgroundColor: "#014983",
              paddingHorizontal: "5%",
              paddingVertical: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={() => props.setVisible(false)}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="chevron-left"
                  type="font-awesome-5"
                  size={25}
                  color="white"
                />
                <Text
                  style={{
                    marginLeft: 10,
                    textAlign: "center",
                    fontSize: 20,
                    color: "white",
                  }}
                >
                  Close
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareImage()}>
              <Icon
                name="share-square"
                solid={true}
                type="font-awesome-5"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          </View>
          {/* ****************************** IMAGE ******************************* */}
          <View
            style={{ flex: 1, backgroundColor: "black", overflow: "hidden" }}
          >
            <Image style={styles.image} source={{ uri: imageURI }} />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeAreaView: { flex: 1, backgroundColor: "black" },
  image: { flex: 1, resizeMode: "contain" },
});

AppImageViewer.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};
