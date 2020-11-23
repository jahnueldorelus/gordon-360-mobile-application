import React from "react";
import { View, StatusBar, SafeAreaView, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { AppbarChat } from "./Components/Chat/index";
import { AppbarRoom } from "./Components/Room/index";
import { Appbar360 } from "./Components/360/index";
import { AppbarProfile } from "./Components/Profile";

export const AppBar = (props) => {
  const styles = StyleSheet.create({
    appBar: {
      backgroundColor: props.route === "Gordon_360" ? "#012849" : "#014983",
      flexDirection: "column",
      // If the device is android, the status bar's height has to be accounted for
      top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      marginBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      padding: 10,
    },
  });
  return (
    <View style={styles.appBar}>
      <StatusBar barStyle="light-content" hidden={false} translucent={true} />
      <SafeAreaView>
        {props.route.name === "Chat" && <AppbarChat {...props} />}
        {props.route.name === "Rooms" && <AppbarRoom {...props} />}
        {props.route === "Gordon_360" && <Appbar360 {...props} />}
        {props.route === "Profile" && <AppbarProfile {...props} />}
      </SafeAreaView>
    </View>
  );
};
