import React from "react";
import { View, StatusBar, SafeAreaView, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { AppbarChat } from "./Components/Chat/index";
import { AppbarRoom } from "./Components/Room/index";
import { Appbar360 } from "./Components/360/index";
import { AppbarProfile } from "./Components/Profile";
import { AppbarSettings } from "./Components/Settings";
import { useRoute } from "@react-navigation/native";
import { ScreenNames } from "../../../ScreenNames";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceOrientation, setAppbarHeight } from "../../store/ui/app";

export const AppBar = (props) => {
  // React Route
  const route = useRoute();
  // Redux dispatch
  const dispatch = useDispatch();
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);

  const styles = StyleSheet.create({
    appBar: {
      backgroundColor: route.name === "Gordon 360" ? "#012849" : "#013b6a",
      flexDirection: "column",
      // If the device is android, the status bar's height has to be accounted for
      top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      marginBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      paddingVertical: 10,
      paddingHorizontal: 10,
      paddingTop:
        Platform.OS === "android"
          ? 10
          : Platform.OS === "ios" && screenOrientation === "portrait"
          ? 27
          : 10,
    },
  });

  return (
    <View
      style={styles.appBar}
      onLayout={(e) => {
        // Saves the appbar's height
        dispatch(setAppbarHeight(e.nativeEvent.layout.height));
      }}
    >
      <StatusBar barStyle="default" hidden={false} translucent={true} />
      <SafeAreaView>
        {route.name === ScreenNames.chat && <AppbarChat />}
        {route.name === ScreenNames.rooms && <AppbarRoom />}
        {route.name === ScreenNames.gordon360 && <Appbar360 {...props} />}
        {route.name === ScreenNames.profile && <AppbarProfile />}
        {route.name === ScreenNames.settings && <AppbarSettings />}
      </SafeAreaView>
    </View>
  );
};
