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

export const AppBar = (props) => {
  // React Route
  const route = useRoute();

  const styles = StyleSheet.create({
    appBar: {
      backgroundColor: route.name === "Gordon 360" ? "#012849" : "#013b6a",
      flexDirection: "column",
      // If the device is android, the status bar's height has to be accounted for
      top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      marginBottom: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      padding: 10,
      paddingTop: Platform.OS === "ios" ? 25 : 10,
    },
  });

  return (
    <View style={styles.appBar}>
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
