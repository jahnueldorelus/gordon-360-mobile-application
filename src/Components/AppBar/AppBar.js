import React from "react";
import { View, Text, Image, StatusBar } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { StyleSheet } from "react-native";
import { AppbarChat } from "./Components/AppbarChat";
import { AppbarRoom } from "./Components/AppbarRoom";
import { AppbarLogin } from "./Components/AppbarLogin";
import { Appbar360 } from "./Components/Appbar360";

export const AppBar = (props) => {
  /**
   * For iPhone X Series, the padding top is calculated to account for the status bar height
   * which blocks part of the screen at the top for the status bar
   */
  let paddingTopForiPhoneX = isIphoneX ? getStatusBarHeight() + 15 : 0;
  // The top and bottom padding for the Appbar
  let paddingVertical = 10;

  const styles = StyleSheet.create({
    appBar: {
      backgroundColor: props.route === "Gordon_360" ? "#012849" : "#014983",
      flexDirection: "column",
      paddingTop: paddingTopForiPhoneX,
      paddingBottom: paddingVertical,
      paddingHorizontal: 10,
    },
    appBarContainer: { flexDirection: "row", alignItems: "center" },
    navigationButton: { marginHorizontal: 10 },
    navigationButtonImage: {
      width: 32,
      height: 32,
      tintColor: "white",
    },
  });

  return (
    <View style={styles.appBar}>
      <StatusBar barStyle="default" hidden={false} translucent={true} />
      {props.route.name === "Chat" && <AppbarChat {...props} />}
      {props.route.name === "Rooms" && <AppbarRoom {...props} />}
      {props.route === "Gordon_360" && <Appbar360 {...props} />}
      {props.route === "Login" && <AppbarLogin {...props} />}
    </View>
  );
};
