import React from "react";
import { View, StatusBar } from "react-native";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { StyleSheet } from "react-native";
import { AppbarChat } from "./Components/Chat/index";
import { AppbarRoom } from "./Components/Room/index";
import { AppbarLogin } from "./Components/Login/index";
import { Appbar360 } from "./Components/360/index";
import { Appbar360Offline } from "./Components/360/Offline";

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
  });

  return (
    <View style={styles.appBar}>
      <StatusBar barStyle="light-content" hidden={false} translucent={true} />
      {props.route.name === "Chat" && <AppbarChat {...props} />}
      {props.route.name === "Rooms" && <AppbarRoom {...props} />}
      {props.route === "Gordon_360" && <Appbar360 {...props} />}
      {props.route === "Login" && <AppbarLogin {...props} />}
      {props.route === "Gordon_360_Offline" && <Appbar360Offline {...props} />}
    </View>
  );
};
