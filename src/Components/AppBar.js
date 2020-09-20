import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";

export const AppBar = (props) => {
  return (
    <View
      style={{
        backgroundColor: "#014983",
        // minHeight: 100,
        maxHeight: 300,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingBottom: 5,
        /**
         * This paddingTop is for devices such as the iPhone X which blocks part of
         * the screen at the top for the status bar
         */
        paddingTop: isIphoneX ? getStatusBarHeight() + 10 : 0,
      }}
    >
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.openDrawer();
            console.log(props);
          }}
        >
          <Image
            style={{ width: 32, height: 32, tintColor: "white" }}
            source={require("./Images/menu.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}></View>
      <Text>{props.currentScreen}</Text>
    </View>
  );
};
