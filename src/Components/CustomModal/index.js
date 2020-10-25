import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  StatusBar,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const CustomModal = (props) => {
  const [viewTop, setViewTop] = useState(
    props.coverScreen ? Dimensions.get("window").height : 0
  );
  const [backgroundViewOpacity, setBackgroundViewOpacity] = useState(0.7);
  const [modalOpacity, setModalOpacity] = useState(1);

  useEffect(() => {
    /**
     * Checks to see if the modal is covering the screen. If so,
     * the state is applied faster to shorten the noticeable delay
     * between the states changing
     */
    if (props.coverScreen) {
      /**
       * Creates the animation of the modal coming up from the bottom
       * The set timeout is IMPORTANT. Do not remove it. Still not sure why this
       * is but without it (even though its timeout is set to 0ms), the animation
       * does not occur. Instead of the modal coming up from the bottom, it fades in
       * (iOS)
       *
       * On Android, it fades it no matter what. Not sure why this happens at all
       */
      setTimeout(() => {
        LayoutAnimation.easeInEaseOut();
        props.height && props.height === "100%"
          ? setViewTop(
              Platform.OS === "android" ? StatusBar.currentHeight : "auto"
            )
          : setViewTop(0);
      }, 0);
    } else {
      LayoutAnimation.easeInEaseOut();
      setModalOpacity(1);
    }
  }, []);

  const styles = StyleSheet.create({
    container: {
      // If the height is not 100% (aka full screen) then we remove the dark background
      backgroundColor:
        props.coverScreen && props.height && props.height === "100%"
          ? `rgba(0,0,0,${backgroundViewOpacity})`
          : "transparent",
      // If the screen will not be covered, then it will appear in the same view
      // currently displayed and not on top of it
      position: props.coverScreen ? "absolute" : "relative",
      bottom: 0,
      // Sets the height if there is one. Default is 100% (full screen)
      height: props.height ? props.height : "100%",
      width: "100%",
      // The opacity of the entire modal
      opacity: modalOpacity,
    },
    safeArea: {
      flex: 1,
      // If the device is Apple, we leave the layout to it's initial values
      // With Android, you have to configure the positions or else the modal will
      // possibly overflow the screen
      position: Platform.OS === "android" ? "absolute" : "relative",
      bottom: Platform.OS === "android" ? 0 : "auto",
      top: viewTop,
      left: Platform.OS === "android" ? 0 : "auto",
      right: Platform.OS === "android" ? 0 : "auto",
    },
    content: {
      flex: 1,
      // If a background color is given, it's applied. Default is White
      backgroundColor: props.backgroundColor ? props.backgroundColor : "white",
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      overflow: "hidden",
    },
    // If a text color for the back button is given, it's applied. Default is Black
    // If a font size for the back button is given, it's applied. Default is 22
    text: {
      color: props.clostTextColor ? props.clostTextColor : "black",
      fontSize: props.closeTextFontSize ? props.closeTextFontSize : 22,
    },
    backButton: {
      paddingLeft: 20,
      paddingVertical: 8,
    },
  });

  return (
    <Animated.View style={styles.container}>
      <SafeAreaView style={[{ top: viewTop }, styles.safeArea]}>
        <Animated.View style={styles.content}>
          <TouchableOpacity
            onPress={() => {
              /**
               * Checks to see if the modal is covering the screen. If so,
               * the state of closing the modal is applied faster to shorten
               * the noticeable delay between the states changing
               */
              if (props.coverScreen) {
                LayoutAnimation.easeInEaseOut();
                setViewTop(Dimensions.get("window").height);
                setBackgroundViewOpacity(0);
                setTimeout(() => {
                  props.setModalVisible(false);
                }, 300);
              } else {
                LayoutAnimation.easeInEaseOut();
                setModalOpacity(0);
                setTimeout(() => {
                  props.setModalVisible(false);
                }, 30);
              }
            }}
            style={styles.backButton}
          >
            <Text style={styles.text}>{"< Back"}</Text>
          </TouchableOpacity>
          {props.content}
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
};
