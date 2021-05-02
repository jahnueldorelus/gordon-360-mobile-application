import React, { useRef, useState } from "react";
import { View, StyleSheet, LayoutAnimation } from "react-native";
import { WebView } from "react-native-webview";
import { NetworkConsumer } from "react-native-offline";
import { LoadingScreen } from "../../Components/LoadingScreen/index";
import { AppBar } from "../../Components/AppBar";
import { OfflineMessage } from "./Components/OfflineMessage";
import { WebViewError } from "./Components/WebViewError";
import { getToken, get360URL } from "../../store/entities/Auth/authSelectors";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export const Gordon360 = () => {
  // App Navigation
  const navigation = useNavigation();

  // Reference to the web view
  const web = useRef(null);

  // The user's token
  const token = useSelector(getToken);
  // Gordon 360's URL
  const gordon360URL = useSelector(get360URL);
  // Determines if the browser can go back a page
  const [canGoBack, setCanGoBack] = useState(false);
  // Determines if the browser can go forward a page
  const [canGoForward, setCanGoForward] = useState(false);
  // Determines if the webpage is loading
  const [loading, setLoading] = useState(false);
  // Determines if a webpage fails to load
  const [loadingError, setLoadingError] = useState(null);
  // The loading progress bar
  const [loadingProgress, setLoadingProgress] = useState("0%");

  // Configures the animation for the progress bar
  LayoutAnimation.easeInEaseOut();

  /**
   * Received function from online.
   * Calculates the interpolator between two numbers. For example, if a = 0 and
   * b = 100, having t = 0.64 would return the number 64. Another example is a = 0,
   * b = 50, and t = 0.5 which would return the number 25.
   * @param {Number} a The minimum number
   * @param {Number} b The maximum number
   * @param {Number} t The decimal percentage to interpolate. Value is
   *                    between 0 and 1
   * @returns {Number} The interpolator between a and b
   */
  function interpolator(a, b, t) {
    return Math.round(a * (1 - t) + b * t);
  }

  if (token)
    return (
      <NetworkConsumer>
        {({ isConnected }) => {
          // Shows the custom modal if the user is offline
          return (
            <View style={styles.screenView}>
              {/* The Appbar that shows the app's navigation and Web Browser controls */}
              <AppBar
                navigation={navigation}
                route="Gordon_360"
                web={web}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                isConnected={isConnected}
              />
              <View style={styles.screenView}>
                {/* The Progress Bar that displays when the Web Browser's loading */}
                {loading && (
                  <View style={styles.loadingBarContainer}>
                    <View
                      style={[styles.loadingBar, { width: loadingProgress }]}
                    />
                  </View>
                )}

                {/* The Web Browser that initially loads Gordon 360 */}
                <WebView
                  ref={web}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  // Adds the token to the WebView's local storage to enable automatic sign in on 360
                  injectedJavaScriptBeforeContentLoaded={`window.localStorage.setItem('token', '"${token}"');`}
                  source={{ uri: gordon360URL }}
                  bounces={false}
                  onNavigationStateChange={(navState) => {
                    setCanGoBack(navState.canGoBack);
                    setCanGoForward(navState.canGoForward);
                  }}
                  textZoom={100}
                  allowsBackForwardNavigationGestures
                  allowsFullscreenVideo
                  dataDetectorTypes="all"
                  onLoadStart={() => setLoading(true)}
                  onLoadEnd={() => {
                    // The page is done loading so the state is changed
                    setLoading(false);
                    // Resets the progress bar back to 0
                    setLoadingProgress("0%");
                  }}
                  onLoadProgress={({ nativeEvent }) => {
                    setLoadingProgress(
                      `${interpolator(0, 100, nativeEvent.progress)}%`
                    );
                  }}
                  onError={({ nativeEvent }) => {
                    setLoadingError(nativeEvent);
                  }}
                  renderError={() => (
                    <WebViewError
                      loadingError={loadingError ? loadingError : null}
                    />
                  )}
                />

                {/* Offline message that appears if the user goes offline */}
                <OfflineMessage
                  isConnected={isConnected}
                  navigation={navigation}
                />
              </View>
            </View>
          );
        }}
      </NetworkConsumer>
    );
  else return <LoadingScreen />;
};

let styles = StyleSheet.create({
  screenView: { flex: 1 },
  loadingBarContainer: { height: 4 },
  loadingBar: {
    height: 4,
    width: "50%",
    backgroundColor: "#028af8",
  },
});
