import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";
import { StyleSheet } from "react-native";

export const AppBar = (props) => {
  return (
    <View style={styles.appBar}>
      <View>
        <TouchableOpacity
          onPress={() => {
            /**
             * If the current screen is the Chat screen
             * Stack Navigator is referenced
             */
            if (props.route.name === "Chat") {
              props.navigation.pop();
              props.navigation.navigate("Rooms");
            } else {
              /**
               * If the current screen is apart of the menu
               * Drawer Navigator is referenced
               */
              props.navigation.openDrawer();
            }
          }}
        >
          <Image
            style={styles.navigationImage}
            source={
              // If the current screen is the Chat screen
              props.route.name === "Chat"
                ? require("./Images/back.png")
                : // If the current screen is the regular menu
                  require("./Images/menu.png")
            }
          />
        </TouchableOpacity>
      </View>
      <View style={styles.navigationOptions}>
        <Text style={styles.navigationOptionsText}>{props.route.name}</Text>
      </View>
    </View>
  );
};

/**
 * For iPhone X Series, the padding top is calculated to account for the status bar height
 * which blocks part of the screen at the top for the status bar
 */
let paddingTopForiPhoneX = isIphoneX ? getStatusBarHeight() + 10 : 0;
// The top and bottom padding for the Appbar
let paddingVertical = 10;

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "#014983",
    maxHeight: 300,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: paddingVertical + paddingTopForiPhoneX,
    paddingBottom: paddingVertical,
  },
  navigationImage: { width: 32, height: 32, tintColor: "white" },
  navigationOptions: { flex: 1, alignItems: "flex-end" },
  navigationOptionsText: { color: "white", fontSize: 18 },
});
