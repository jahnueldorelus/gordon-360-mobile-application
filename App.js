import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
} from "react-native";

import { WebView } from "react-native-webview";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <WebView
        style={styles.webview}
        source={{ uri: "https://360.gordon.edu" }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "black",
    width: deviceWidth,
    height: deviceHeight,
  },
});
