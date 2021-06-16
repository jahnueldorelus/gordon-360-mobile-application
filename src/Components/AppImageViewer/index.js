import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Share,
} from "react-native";
import { getImage } from "../../Services/Messages";
import { getDeviceOrientation } from "../../store/ui/app";
import { Icon } from "react-native-elements";
import * as FileSystem from "expo-file-system";
import PropTypes from "prop-types";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";

/**
 * Creates the Custom Image Viewer
 * @param {JSON} props Props passed from parent
 */
export const AppImageViewer = (props) => {
  // The image
  const [imageURI, setImageURI] = useState(null);
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);
  // The device's orientation reference
  const screenOrientationRef = useRef(screenOrientation);
  // The default HTML soure
  const defaultHTMLSource = `<html lang="en" dir="ltr"><body style="background-color: ${styles.safeAreaView.backgroundColor}" /></html>`;
  // The HTML source
  const [htmlSource, setHTMLSource] = useState(defaultHTMLSource);

  /**
   * If the image is a path to a local image, the image is retrieved
   * and converted to base64
   */
  useEffect(() => {
    getBase64Format(props.image);
  }, [props.image]);

  /**
   * Sets the HTML source of the webview to the default when
   * the device's orientation changes. This i
   */
  useEffect(() => {
    if (screenOrientation !== screenOrientationRef.current) {
      // Sets the default HTML soource
      setHTMLSource(defaultHTMLSource);
      // Updates the screen orientation reference
      screenOrientationRef.current = screenOrientation;
    }
  }, [screenOrientation]);

  /**
   * Sets the HTML source of the webview if the HTML source
   * is the default source and the image to show is available
   */
  useEffect(() => {
    if (htmlSource === defaultHTMLSource && imageURI) {
      // Sets the default HTML soource
      setHTMLSource(getHTMLSource(imageURI));
      // Updates the screen orientation reference
      screenOrientationRef.current = screenOrientation;
    } else if (htmlSource === defaultHTMLSource && !imageURI) {
      /**
       * If the HTML source is the default and there's no image to show
       * the HTML source is recreated using the image received through props
       */
      getBase64Format(props.image);
    }
  }, [htmlSource, imageURI]);

  /**
   * Gets the HTML source for the webview
   * @param {string} image The base64 string of an image
   * @returns {string} The HTML source
   */
  const getHTMLSource = (image) => {
    return `
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>Image</title>
        <style>
          body {
            background-color: ${styles.safeAreaView.backgroundColor};
            margin: 0;
            display: flex;
            -webkit-user-select: none;
          }
          img {
            height: 100%;
            width: 100%;
            object-fit: contain; 
          }
        </style>
      </head>
      <body>
        <img src=${image} alt="Image" />
      </body>
    </html>
  `;
  };

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
        // Sets the image
        setImageURI(newImageURI);
        // Sets the HTML content for the webview
        setHTMLSource(getHTMLSource(newImageURI));
      }
      // If the image is a path to the image on the local device, it's converted to base64
      else if (image.includes("file:")) {
        const newImageURI =
          "data:image/gif;base64," +
          (await FileSystem.readAsStringAsync(image, {
            encoding: FileSystem.EncodingType.Base64,
          }));
        // Sets the image
        setImageURI(newImageURI);
        // Sets the HTML content for the webview
        setHTMLSource(getHTMLSource(newImageURI));
      }
      // Since the image is not a file path, it's base64
      else {
        const newImageURI = "data:image/gif;base64," + image;
        // Sets the image
        setImageURI(newImageURI);
        // Sets the HTML content for the webview
        setHTMLSource(getHTMLSource(newImageURI));
      }
    }
  };

  /**
   * Refreshes the webview if the screen orientation changes
   * to prevent the user from being displayed the wrong part of the
   * picture as the scrollview orientation
   */

  /**
   * Shares the image given to this component
   */
  const shareImage = async () => {
    Share.share({
      url: imageURI,
      type: "image/png",
      filename: "image.png",
      message: "",
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
        <View style={styles.buttonContainer}>
          <SafeAreaView style={styles.safeAreaButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => {
                // Resets the image source used in the webview
                setImageURI(null);
                // Closes out the image viewer
                props.setVisible(false);
              }}
            >
              <View style={styles.closeButton}>
                <Icon
                  name="chevron-left"
                  type="font-awesome-5"
                  size={25}
                  color="white"
                />
                <Text style={styles.closeButtonText}>Close</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.75} onPress={() => shareImage()}>
              <Icon
                name="share-square"
                solid={true}
                type="font-awesome-5"
                size={25}
                color="white"
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
        {/* ****************************** IMAGE ******************************* */}
        <SafeAreaView style={styles.safeAreaView}>
          <WebView
            javaScriptEnabled={true}
            source={{
              html: htmlSource,
            }}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.webview}
            renderLoading={() => <View style={styles.loadingView} />}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeAreaButtonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    backgroundColor: "#014983",
    paddingHorizontal: "5%",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  closeButton: { flexDirection: "row", alignItems: "center" },
  closeButtonText: {
    marginLeft: 10,
    textAlign: "center",
    fontSize: 20,
    color: "white",
  },
  safeAreaView: { flex: 1, backgroundColor: "black" },
  webview: { backgroundColor: "black" },
  loadingView: { backgroundColor: "black", flex: 1 },
});

AppImageViewer.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};
