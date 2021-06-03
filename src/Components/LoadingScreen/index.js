import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import PropTypes from "prop-types";
import { Dimensions } from "react-native";

export const LoadingScreen = (props) => {
  // The image scale value
  const initialImageScale = 1;
  // The loading text opacity
  const initialLoadingTextOpacity = 0.7;

  // The animated scale value of the image
  const animatedImageScale = useRef(
    new Animated.Value(initialImageScale)
  ).current;
  // The animated opacity value of the loading text
  const animatedLoadingTextOpacity = useRef(
    new Animated.Value(initialLoadingTextOpacity)
  ).current;

  // Animates the image's scale back and forth
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedImageScale, {
          toValue: 1.15,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedImageScale, {
          toValue: initialImageScale,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animates the loading text's opacity back and forth
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedLoadingTextOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedLoadingTextOpacity, {
          toValue: initialLoadingTextOpacity,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.loadingImageContainer}>
      <Animated.Image
        source={require("./Image/mascot.png")}
        style={[
          styles.loadingImage,
          { transform: [{ scale: animatedImageScale }] },
        ]}
      />
      <Animated.Text
        style={[
          styles.loadingImageText,
          { opacity: animatedLoadingTextOpacity },
        ]}
      >
        {props.loadingText ? props.loadingText : "Loading..."}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    backgroundColor: "white",
  },
  loadingImage: {
    resizeMode: "contain",
    width: "50%",
    height: "50%",
  },
  loadingImageText: {
    padding: 30,
    marginTop: 20,
    fontSize:
      /**
       * Attempts to set a font size according to the device's dimensions.
       * The minimum font size allowed is 30
       */
      Dimensions.get("window").width * 0.05 > 30
        ? Dimensions.get("window").width * 0.05
        : 30,
    color: "#014983",
    fontWeight: "bold",
    textAlign: "center",
  },
});

LoadingScreen.propTypes = {
  /**
   * The text that will display while loading. The word,
   * "Loading" will appear by default.
   */
  loadingText: PropTypes.string,
};
