import React, { useEffect, useRef } from "react";
import { View, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export const Appbar360 = (props) => {
  return (
    <View style={styles.appBarContainer}>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.openDrawer();
          }}
          style={styles.navigationButton}
        >
          <Image
            style={styles.navigationButtonImage}
            source={require("./Images/hamburger_menu.png")}
          />
          <Text style={styles.navigationButtonText}>Gordon 360</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.webControlsContainer}>
        <TouchableOpacity
          disabled={!props.canGoBack && !props.isConnected}
          onPress={() => {
            // Goes back a page in the webview
            if (props.web) props.web.current.goBack();
          }}
        >
          <Image
            style={
              props.canGoBack && props.isConnected
                ? styles.navigationButtonImage
                : styles.navigationButtonImageDisabled
            }
            source={require("./Images/backward.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!props.canGoForward && props.isConnected}
          onPress={() => {
            // Goes forward a page in the webview
            if (props.web) props.web.current.goForward();
          }}
        >
          <Image
            style={[
              props.canGoForward && props.isConnected
                ? styles.navigationButtonImage
                : styles.navigationButtonImageDisabled,
              styles.webControlButtonSpacing,
            ]}
            source={require("./Images/forward.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!props.isConnected}
          onPress={() => {
            // Refreshes the page in the webview
            if (props.web) {
              props.web.current.reload();
            }
          }}
        >
          <Image
            style={
              props.isConnected
                ? styles.navigationButtonImage
                : styles.navigationButtonImageDisabled
            }
            source={require("./Images/refresh.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
  },
  navigationContainer: {
    flexDirection: "row",
    flex: 1,
  },
  navigationButton: {
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  navigationButtonImage: {
    width: 32,
    height: 32,
    tintColor: "white",
  },
  navigationButtonImageDisabled: {
    width: 32,
    height: 32,
    tintColor: "rgba(255,255,255,0.3)",
  },
  navigationButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  webControlsContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
    flex: 1,
  },
  webControlButtonSpacing: {
    marginHorizontal: 30,
  },
});
