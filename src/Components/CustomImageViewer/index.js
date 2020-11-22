import React, { createRef } from "react";
import { Dimensions, StyleSheet, View, Text, Animated } from "react-native";
import {
  PinchGestureHandler,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Creates the Custom Image Viewer
 * @param {JSON} props Props passed from parent
 */
export const CustomImageViewer = (props) => {
  // Get's the dimensions of the devices's screen
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  // Gesture Handler References
  const imagePinchHandler = createRef();
  const imagePanHandler = createRef();

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
    /* *********************** START PINCH FUNCTIONS ************************** */
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

  // This is used to measure the X value of the center of the image being zoomed
  const imageX = new Animated.Value(0);

  // This is used to measure the Y value of the center of the image being zoomed
  const imageY = new Animated.Value(0);

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
          focalX: imageX,
          focalY: imageY,
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
      // console.log(event.nativeEvent);
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

    /**
     * Checks to see if the new zoom scale is more than . If it's more than 15, then
     * the image has reached it's zoom limit. Therefore, an animation brings the image
     * back to the maximum zoom scale size which is 15.
     */
    if (lastScale > 15) {
      lastScale = 15; // Resets the lastScale back to the maximum scale of 15
      Animated.spring(baseScale, {
        toValue: 15,
        useNativeDriver: true,
      }).start();
    }
  };
  {
    /* *********************** END PINCH FUNCTIONS ************************** */
  }

  {
    /* *********************** START PAN FUNCTIONS ************************** */
  }

  const viewX = new Animated.Value(0);
  const viewY = new Animated.Value(0);
  const lastOffset = { x: 0, y: 0 };

  /**
   * Function that runs after there's been a state change in the PanGestureHandler.
   * This is used to get the last scaling value after the user stops moving the image.
   */
  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: viewX,
          translationY: viewY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  /**
   * Function that runs after there's been a state change in the PanGestureHandler.
   * This is used to get the last position of the user's touch after the user
   * stops moving the image.
   */
  const onPanGestureStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset.x += event.nativeEvent.translationX;
      lastOffset.y += event.nativeEvent.translationY;
      viewX.setOffset(lastOffset.x);
      viewX.setValue(0);
      viewY.setOffset(lastOffset.y);
      viewY.setValue(0);
    }
  };

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
        <View style={{ flex: 1, backgroundColor: "white", overflow: "hidden" }}>
          <PanGestureHandler
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={onPanGestureStateChange}
            ref={imagePanHandler}
            simultaneousHandlers={imagePinchHandler}
          >
            <Animated.View
              style={{
                flex: 1,
                transform: [
                  { translateX: viewX },
                  { translateY: viewY },
                  { scale: zoomScale },
                ],
                backgroundColor: "black",
              }}
            >
              <PinchGestureHandler
                onGestureEvent={onPinchEvent}
                onHandlerStateChange={onPinchStateChange}
                ref={imagePinchHandler}
                simultaneousHandlers={imagePanHandler}
              >
                <Animated.Image
                  style={{
                    flex: 1,
                  }}
                  source={{ uri: props.image }}
                  resizeMode="contain"
                />
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </View>
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
