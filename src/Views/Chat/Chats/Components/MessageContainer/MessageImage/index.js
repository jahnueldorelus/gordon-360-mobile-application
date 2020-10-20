import React, { useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Animated,
} from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import ImageViewer from "react-native-image-zoom-viewer";

/**
 * Just a function that calls the real component MessageImage
 * @param {JSON} props Props passed from parent
 */
export const renderMessageImage = (props) => {
  return <MessageImage {...props} />;
};

/**
 * Renders the message image in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
const MessageImage = (props) => {
  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const [previewVisible, setPreviewVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      paddingTop: 10,
      marginBottom: 6,
    },
    image: {
      maxWidth: (deviceWidth / 3) * 2, // Allows up to two-thirds of the screen
      height: deviceHeight / 4,
      borderRadius: 5,
    },
  });

  {
    /* *************************************************************************** */
  }

  /**
   * Helper variables for calculating the zoom scale of the image preview
   * DON'T REMOVE THESE FROM HERE - These variables must be initialized here at
   * the start of the component. If any of these variables are moved within the function
   * that handles the PinchGestureHandler's state change, they will be overwritten and
   * cause glitches or errors while zooming on the image.
   */

  // The actual scale to be used for the preview image.
  const baseScale = new Animated.Value(1);

  // This is used to measure the continously changing zoom scale recorded by the
  // PinchGestureHandler. This measurement creates the smooth scaling animation while zooming
  const pinchScale = new Animated.Value(1);

  // This is incredibly important and must not be removed. While this will always
  // have the same value as baseScale, it's needed because you cannot access the
  // value of an Animated.Value object. You're only allowed to set it. Therefore,
  // lastScale is our helper variable that allows us to access the value of baseScale
  let lastScale = 1;

  // The official zoom scale used to scale the preview image
  const zoomScale = Animated.multiply(baseScale, pinchScale);

  /**
   * Function that runs when the scaling of the PinchGestureHandler changes.
   * This creates the smooth animation from zooming in and out.
   */
  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: {
          scale: pinchScale,
        },
      },
    ],
    { useNativeDriver: true }
  );

  /**
   * Function that runs after there's been a state change in the PinchGestureHandler.
   * This is used to get the last scaling value after the user stops zooming the image.
   */
  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Calculates the image's new preview scale
      lastScale *= event.nativeEvent.scale;

      // Sets the new image preview scale by converting it to an Animated.Value object
      baseScale.setValue(lastScale);

      /**
       * While the user zoomed through the image, the variable pinchScale continously changed.
       * In order to set the variable zoomValue to the correct scale (which is the same value
       * contained in baseScale), we must set pinchScale to 1.
       */
      pinchScale.setValue(1);
    }

    /**
     * Checks to see if the new zoom scale is less than 1. If it's less than 1, then
     * the image is smaller than its original size. Therfore, an animation brings the
     * image back to its original scale which is the default value of 1.
     */
    if (lastScale < 1) {
      lastScale = 1; // Resets the lastScale back to the default scale of 1
      Animated.spring(baseScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }

    console.log(lastScale);
  };

  {
    /* *************************************************************************** */
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setPreviewVisible(true)}>
        <Image
          style={styles.image}
          source={{ uri: props.currentMessage.image }}
        />
      </TouchableOpacity>
      <Modal
        visible={previewVisible}
        presentationStyle="fullscreen"
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
        onDismiss={() => setPreviewVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          {/* <ImageViewer
            imageUrls={[{ url: props.currentMessage.image }]}
            backgroundColor="black"
            enableSwipeDown
            onSwipeDown={() => setPreviewVisible(false)}
            swipeDownThreshold={200}
            renderHeader={() => (
              <View style={{ flex: 1, backgroundColor: "red" }}>
                <Text style={{ color: "white" }}>HEY THERE</Text>
              </View>
            )}
          /> */}
          <View style={{ backgroundColor: "#014983" }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                padding: 10,
                color: "white",
              }}
              onPress={() => setPreviewVisible(false)}
            >
              Tap Here to Close Preview
            </Text>
          </View>
          <View
            style={{ flex: 1, backgroundColor: "white", overflow: "hidden" }}
          >
            {/* *************************************************************************** */}
            <PinchGestureHandler
              onGestureEvent={onPinchEvent}
              onHandlerStateChange={onPinchStateChange}
              style={{ flex: 1 }}
            >
              <Animated.Image
                style={{
                  flex: 1,
                  transform: [{ perspective: 200 }, { scale: zoomScale }],
                }}
                source={{ uri: props.currentMessage.image }}
                resizeMode="contain"
              />
            </PinchGestureHandler>
            {/* <Image
              style={{
                flex: 1,
                resizeMode: "contain",
              }}
              source={{ uri: props.currentMessage.image }}
            /> */}

            {/* *************************************************************************** */}
          </View>
          <View style={{ backgroundColor: "#014983" }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                padding: 10,
                color: "white",
              }}
              onPress={() => setPreviewVisible(false)}
            >
              Tap Here to Close Preview
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};
