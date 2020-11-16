import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  StatusBar,
} from "react-native";
import PropTypes from "prop-types";

export const CustomModal = (props) => {
  const [viewHeight, setViewHeight] = useState(0);
  const [visible, setVisible] = useState(true);
  // Checks to see if the prop coverScreen is enabled. If not, the prop
  // containInView is automatically enabled. This prevents the modal from not displaying
  const [containInView, setContainInView] = useState(
    !props.coverScreen ? true : props.containInView
  );
  const deviceHeight = Dimensions.get("window").height;

  // Saves the data of the visibility prop for comparison if the prop changes
  const oldVisibleProp = useRef(props.visible);

  useEffect(() => {
    // Displays opening animation
    if (props.visible !== oldVisibleProp.current) {
      /**
       * Creates the animation of the modal coming up from the bottom
       * The set timeout is IMPORTANT. Do not remove it. Still not sure why this
       * is but without it (even though its timeout is set to 0ms), the animation
       * does not occur. Instead of the modal coming up from the bottom, it fades in
       * (iOS)
       *
       * On Android, it fades in no matter what. Not sure why that happens
       */
      setTimeout(() => {
        LayoutAnimation.easeInEaseOut();
        setViewHeight(getViewHeight());
      }, 0);

      setVisible(true);
    }

    // Displays closing animation
    else {
      LayoutAnimation.easeInEaseOut();
      setViewHeight("0%");
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }
  }, [props.visible]);

  // Gets the height of the modal by ratio of the given height
  const getViewHeight = () => {
    let height = 0;
    // If the modal will appear over all content, a ratio is determined
    // with the device's height
    if (props.coverScreen)
      height = Math.round(deviceHeight * (props.height / 100));
    // If the modal will be contained in its parent view, a percentage
    // is used instead of a number
    if (containInView) height = `${props.height}%`;
    return height;
  };

  // If visible, show the modal. Otherwise, return nothing
  if (visible) {
    const styles = StyleSheet.create({
      container: {
        backgroundColor: "transparent",
        // If the screen will not be covered, then it will appear in the same view
        // currently displayed and not on top of it
        position: props.coverScreen ? "absolute" : "relative",
        height: viewHeight,
        // Android only, sets the maximum height of the modal
        maxHeight:
          Platform.OS === "android"
            ? deviceHeight - StatusBar.currentHeight
            : "auto",
        width: "100%",
        bottom: 0,
      },
      view: {
        flex: 1,
      },
      content: {
        flex: 1,
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : "white",
        borderTopRightRadius: props.coverScreen ? 15 : 0,
        borderTopLeftRadius: props.coverScreen ? 15 : 0,
        overflow: "hidden",
      },
    });

    return (
      <Animated.View style={styles.container}>
        <View style={[styles.view]}>
          <Animated.View style={styles.content}>{props.content}</Animated.View>
        </View>
      </Animated.View>
    );
  } else {
    return <></>;
  }
};

CustomModal.propTypes = {
  backgroundColor: PropTypes.string,
  content: PropTypes.object.isRequired,
  coverScreen: PropTypes.bool,
  containInView: PropTypes.bool,
  height: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
};
