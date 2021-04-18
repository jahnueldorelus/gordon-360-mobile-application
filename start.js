import React, { useEffect, useRef } from "react";
import { AppBar } from "./src/Components/AppBar";
import { View, StyleSheet, AppState } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatView } from "./src/Views/Chat/ChatView";
import { RoomsList } from "./src/Views/Rooms";
import { Login } from "./src/Views/Login";
import { AppSettings } from "./src/Views/AppSettings";
import { Profile } from "./src/Views/Profile";
import { Gordon360 } from "./src/Views/Gordon360";

import {
  setNewToken,
  registerForPushNotificationsAsync,
  notificationResponseHandler,
  notificationReceivedHandler,
  handleAppStateChange,
} from "./src/Services/Notifications/index";
import * as Notifications from "expo-notifications";
/**
 * The function below, "getFullMessageFromServer" is imported into this moodule
 * and passed into the functions from the Notifications module to prevent a
 * require cycle that could potentially cause issues.
 */
import { getFullMessageFromServer } from "./src/store/entities/chat";
import { useDispatch } from "react-redux";

export const Start = () => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // Navigators
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();
  const notificationReceivedListener = useRef();
  const notificationResponseListener = useRef();
  const previousAppState = useRef(AppState.currentState);

  /**
   * Notification and Application State Listeners
   */
  useEffect(() => {
    // Attempts to get the user's permission to allow notifications
    registerForPushNotificationsAsync(dispatch);

    // Notification Token Listener
    const tokenListener = Notifications.addPushTokenListener((newToken) =>
      setNewToken(newToken, dispatch)
    );

    // Notification Received Listener
    notificationReceivedListener.current = Notifications.addNotificationReceivedListener(
      (notification) =>
        notificationReceivedHandler(
          notification,
          getFullMessageFromServer,
          dispatch
        )
    );
    // Notification Response Listener
    notificationResponseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) =>
        notificationResponseHandler(
          response.notification,
          getFullMessageFromServer,
          dispatch
        )
    );

    /**
     * App State Listener
     */
    AppState.addEventListener("change", (nextAppState) =>
      handleAppStateChange(
        previousAppState,
        nextAppState,
        getFullMessageFromServer,
        dispatch
      )
    );

    // Removes the notification and app state listeners
    return () => {
      Notifications.removeNotificationSubscription(
        notificationReceivedListener.current
      );
      Notifications.removeNotificationSubscription(
        notificationResponseListener.current
      );
      AppState.removeEventListener("change", (nextAppState) =>
        handleAppStateChange(nextAppState)
      );
      tokenListener.remove();
    };
  }, []);

  // Gordon 360 Screen
  const Gordon360Page = ({ navigation }) => {
    return <Gordon360 navigation={navigation} />;
  };

  // Messages Screen
  const Messages = () => {
    return (
      <View style={styles.screenView}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Rooms">
            {(props) => (
              // Rooms Screen
              <View style={styles.screenView}>
                <AppBar {...props} />
                <RoomsList {...props} />
              </View>
            )}
          </Stack.Screen>
          <Stack.Screen name="Chat">
            {(props) => (
              // Chat Screen
              <View style={styles.screenView}>
                <ChatView {...props} />
              </View>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </View>
    );
  };

  const Settings = ({ navigation }) => {
    return (
      <View style={styles.screenView}>
        <AppBar navigation={navigation} />
        <AppSettings />
      </View>
    );
  };

  // User Profile Screen
  const ProfilePage = ({ navigation }) => {
    return (
      <View style={styles.screenView}>
        <AppBar navigation={navigation} route="Profile" />
        <Profile />
      </View>
    );
  };

  // Login Screen
  const LoginPage = ({ navigation }) => {
    return (
      <View style={styles.screenView}>
        <Login navigation={navigation} />
      </View>
    );
  };

  return (
    <Drawer.Navigator initialRouteName="Messages" drawerType="slide">
      <Drawer.Screen name="Profile" component={ProfilePage} />
      <Drawer.Screen
        name="Gordon 360"
        component={Gordon360Page}
        /**
         * Prevent users from accessing the drawer navigator using gestures
         * Since the WebView uses gestures for navigating through the browser's
         * history, the drawer navigator interferes with swiping gesture to go back a page
         */
        options={{ swipeEnabled: false }}
      />
      <Drawer.Screen name="Messages" component={Messages} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen
        name="Login"
        component={LoginPage}
        /**
         * Prevent users from accessing the drawer navigator using gestures
         */
        options={{ swipeEnabled: false }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  screenView: { flex: 1 },
});
