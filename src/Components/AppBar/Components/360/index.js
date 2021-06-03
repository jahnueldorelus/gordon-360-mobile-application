import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export const Appbar360 = (props) => {
  // React Native Navigation
  const navigation = useNavigation();

  return (
    <View style={styles.appBarContainer}>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            navigation.openDrawer();
          }}
          style={styles.navigationButton}
        >
          <Icon
            name="arrow-circle-left"
            type="font-awesome-5"
            color="white"
            size={28}
          />
          <Text style={styles.navigationButtonText}>Gordon 360</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.webControlsContainer}>
        <Icon
          name="arrow-left"
          type="font-awesome-5"
          color={
            props.canGoBack && props.isConnected
              ? "white"
              : "rgba(255,255,255,0.3)"
          }
          disabled={!props.canGoBack || !props.isConnected}
          size={24}
          onPress={() => {
            // Goes back a page in the webview
            if (props.web) props.web.current.goBack();
          }}
          iconStyle={styles.webControlButtonSpacing}
          disabledStyle={styles.webControlButtonDisabled}
        />
        <Icon
          name="arrow-right"
          type="font-awesome-5"
          color={
            props.canGoForward && props.isConnected
              ? "white"
              : "rgba(255,255,255,0.3)"
          }
          disabled={!props.canGoForward || !props.isConnected}
          size={24}
          onPress={() => {
            // Goes forward a page in the webview
            if (props.web) props.web.current.goForward();
          }}
          iconStyle={styles.webControlButtonSpacing}
          disabledStyle={styles.webControlButtonDisabled}
        />

        <Icon
          name="sync"
          type="font-awesome-5"
          disabled={!props.isConnected}
          size={24}
          color={props.isConnected ? "white" : "rgba(255,255,255,0.3)"}
          onPress={() => {
            // Refreshes the page in the webview
            if (props.web) {
              props.web.current.reload();
            }
          }}
          iconStyle={styles.webControlButtonSpacing}
          disabledStyle={styles.webControlButtonDisabled}
        />
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
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
  },
  webControlButtonSpacing: {
    marginHorizontal: "10%",
  },
  webControlButtonDisabled: {
    backgroundColor: "transparent",
  },
});
