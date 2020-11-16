import React from "react";
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
            style={styles.navigationButtonImageEnabled}
            source={require("../Images/hamburger_menu.png")}
          />
          <Text style={styles.navigationButtonText}>
            {props.showOffline ? "Gordon 360 Offline" : "Gordon 360"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // Shows Gordon 360 offline version in modal
            props.setShowOffline(!props.showOffline);
          }}
          style={styles.navigationButton}
        >
          <Image
            style={styles.navigationButtonImageEnabled}
            source={
              props.showOffline
                ? require("../Images/online.png")
                : require("../Images/offline.png")
            }
          />
        </TouchableOpacity>
      </View>

      {!props.showOffline && (
        <View style={styles.webControlsContainer}>
          <TouchableOpacity
            disabled={!props.canGoBack}
            onPress={() => {
              // Goes back a page in the webview
              if (props.web) props.web.current.goBack();
            }}
            style={styles.navigationButton}
          >
            <Image
              style={
                props.canGoBack
                  ? styles.navigationButtonImageEnabled
                  : styles.navigationButtonImageDisabled
              }
              source={require("../Images/backward.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!props.canGoForward}
            onPress={() => {
              // Goes forward a page in the webview
              if (props.web) props.web.current.goForward();
            }}
            style={styles.navigationButton}
          >
            <Image
              style={
                props.canGoForward
                  ? styles.navigationButtonImageEnabled
                  : styles.navigationButtonImageDisabled
              }
              source={require("../Images/forward.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Refreshes the page in the webview
              if (props.web) props.web.current.reload();
            }}
            style={styles.navigationButton}
          >
            <Image
              style={styles.navigationButtonImageEnabled}
              source={require("../Images/refresh.png")}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "column",
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navigationButton: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  navigationButtonImageEnabled: {
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
    justifyContent: "space-evenly",
    flexDirection: "row",
    marginTop: 10,
  },
});
