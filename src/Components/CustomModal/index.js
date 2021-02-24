import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  StatusBar,
} from "react-native";
import PropTypes from "prop-types";

export const CustomModal = (props) => {
  const [visible, setVisible] = useState(null);
  // Checks to see if the prop coverScreen is enabled. If not, the prop
  // containInView is automatically enabled. This prevents the modal from not displaying
  const [containInView, setContainInView] = useState(
    !props.coverScreen ? true : props.containInView
  );
  const deviceHeight = Dimensions.get("window").height;

  LayoutAnimation.easeInEaseOut();

  // Gets the height of the modal by ratio of the given height
  const getViewHeight = () => {
    // If the height given is 0 or no height is given at all, then
    // the modal's height is based off the height of the content provided.
    if (!props.height || props.height === 0) {
      return "auto";
    }
    // If the height given is not 0, then a percentage of the height is calculated
    else {
      let height = 0;
      // If the modal will appear over all content, a ratio is determined
      // with the device's height
      if (props.coverScreen)
        height = Math.round(deviceHeight * (props.height / 100));
      // If the modal will be contained in its parent view, a percentage
      // is used instead of a number
      if (containInView) height = `${props.height}%`;
      return height;
    }
  };

  // The view height of the modal
  const [viewHeight, setViewHeight] = useState(getViewHeight());

  useEffect(() => {
    if (props.visible) {
      // Displays opening animation
      setViewHeight(getViewHeight());
      setVisible(true);
    } else {
      // Displays closing animation of the modal if it was opened
      setViewHeight(null);
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }
  }, [props.visible]);

  // If visible, show the modal. Otherwise, return nothing
  if (visible) {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "white",
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
        overflow: "hidden",
        borderTopRightRadius: props.roundedCorners ? 30 : 0,
        borderTopLeftRadius: props.roundedCorners ? 30 : 0,
        ...props.styles,
      },
      view: {
        flex: 1,
        overflow: "hidden",
      },
      content: {
        flex: 1,
        overflow: "hidden",
      },
    });

    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <View style={styles.content}>{props.content}</View>
        </View>
      </View>
    );
  } else {
    return <></>;
  }
};

CustomModal.propTypes = {
  content: PropTypes.object.isRequired,
  coverScreen: PropTypes.bool,
  containInView: PropTypes.bool,
  height: PropTypes.number,
  visible: PropTypes.bool.isRequired,
  roundedCorners: PropTypes.bool,
  styles: PropTypes.object,
};
