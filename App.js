import React, { useRef } from "react";
import {
  NativeModules,
  Platform,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { store, persistor } from "./src/store/configuration/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { Start } from "./start";
import { ErrorBoundary } from "react-error-boundary";
import { setJSExceptionHandler } from "react-native-exception-handler";
import * as Sentry from "sentry-expo";
import { resetUI } from "./src/Services/App";

export default function App() {
  /**
   * Determines if an alert has already been shown. This prevents
   * multiple error alerts from displaying
   */
  const isErrorAlertShowing = useRef(false);

  /**
   * Initializes Sentry. Sentry is a cloud-based error monitoring platform
   * used to track errors received in the app
   */
  Sentry.init({
    // Our unique Sentry account ID
    dsn: "https://9339279db3f84de2b771883e5ad7c18f@o719019.ingest.sentry.io/5780934",
    // Determines if errors should be reported while in development mode
    enableInExpoDevelopment: false,
  });

  // This enables layout animation for Android
  if (Platform.OS === "android") {
    const { UIManager } = NativeModules;
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  /**
   * Handles all JS errors that Error Boundary cannot catch.
   * These errors are event handlers, asynchronous code, and
   * errors in the Error Boundary itself
   */
  setJSExceptionHandler(
    (
      // The error that occured
      error, // String
      // Determines if the error is fatal (aka would crash the app)
      isFatal // Boolean
    ) => {
      // If an error alert isn't already showing, an alert is displayed
      if (!isErrorAlertShowing.current) {
        // Sends the error to Sentry
        Sentry.Native.captureException(error);
        // Sets the value of an error alert being displayed as true
        isErrorAlertShowing.current = true;
        // Alerts the user an error occured and that an app restart is required
        Alert.alert(
          "Unexpected Error",
          "Unfortunately, an error has occured. \n\nIf the app no longer functions correctly, please" +
            " " +
            "exit out of the app and remove it from your multitasking pane before reopening it.",
          [
            {
              text: "Okay",
              onPress: () => {
                // Sets the value of an error alert being displayed as false
                isErrorAlertShowing.current = false;
              },
            },
          ]
        );
      }
    },
    /**
     * Determines if the exeception handler should be enabled in development
     * mode. Enabling it isn't recommended as the errors that it captures will
     * not be shown on the UI. Therefore, an error may occur and you will not
     * know about it.
     */
    false
  );

  /**
   * An error handler if an error occurs in the app
   * @param {string} error The error message
   */
  const errorHandler = (error) => {
    // Sends the error to Sentry
    Sentry.Native.captureException(error);
  };

  /**
   * A fallback component to display if an error occurs in the UI of the app
   * @param {Function} resetErrorBoundary Restarts the app
   */
  const errorFallback = ({ resetErrorBoundary }) => (
    <SafeAreaView style={styles.errorSafeAreaView}>
      <ScrollView
        style={styles.errorScrollView}
        contentContainerStyle={styles.errorScrollViewContentContainer}
        /**
         * Scroll indicator prevents glitch with scrollbar appearing
         * in the middle of the screen
         */
        scrollIndicatorInsets={{ right: 1 }}
      >
        <View style={styles.errorScrollViewContainer}>
          <Icon
            name={"exclamation-circle"}
            type="font-awesome"
            color="#830149"
            solid={true}
            size={Dimensions.get("window").width / 4}
          />
          <Text style={styles.errorTextTitle}> An error has occured </Text>
          <Text style={styles.errorTextInfo}>
            Unfortunately, an error has occured while processing some data.
            Please tap on "Restart App" below to reload the app.
          </Text>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              // Resets the UI state
              resetUI(store.dispatch);
              // Restarts the app
              resetErrorBoundary();
            }}
            style={styles.errorButton}
          >
            <Text style={styles.errorButtonText}>Restart App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <ErrorBoundary FallbackComponent={errorFallback} onError={errorHandler}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <View style={styles.screenView}>
            <NavigationContainer>
              <Start />
            </NavigationContainer>
          </View>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screenView: { flex: 1 },
  errorSafeAreaView: {
    flex: 1,
    backgroundColor: "black",
  },
  errorScrollView: { flex: 1, backgroundColor: "white" },
  errorScrollViewContentContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: "10%",
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  errorTextTitle: {
    margin: 10,
    marginTop: 20,
    fontSize: 24,
    color: "#490128",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorTextInfo: {
    margin: 10,
    fontSize: 18,
    color: "#220013",
    textAlign: "center",
  },
  errorButton: {
    margin: 10,
    paddingHorizontal: 15,
    paddingVertical: 2,
    backgroundColor: "#3d496e",
    alignSelf: "center",
    borderRadius: 50,
  },
  errorButtonText: {
    margin: 10,
    fontSize: 18,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
