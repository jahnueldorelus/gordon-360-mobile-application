import React, { useEffect, useRef } from "react";
import { AppBar } from "./src/Components/AppBar";
import { View, StyleSheet, AppState } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "./src/Views/Login";
import { AppSettings } from "./src/Views/AppSettings";
import { Profile } from "./src/Views/Profile";
import { Gordon360 } from "./src/Views/Gordon360";
import { ChatView } from "./src/Views/Chat/ChatView";
import { RoomsList } from "./src/Views/Rooms";
import {
  registerForPushNotificationsAsync,
  notificationResponseHandler,
  notificationReceivedHandler,
  handleAppStateChange,
} from "./src/Services/Notifications/index";
import {
  getChatOpenedAndVisible,
  getSelectedRoomID,
} from "./src/store/ui/Chat/chatSelectors";
import * as Notifications from "expo-notifications";
/**
 * The function below, "getFullMessageFromServer" is imported into this moodule
 * and passed into the functions from the Notifications module to prevent a
 * require cycle that could potentially cause issues.
 */
import { getFullMessageFromServer } from "./src/store/entities/chat";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import { ScreenNames } from "./ScreenNames";

export const Screen = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // Navigators
  const Stack = createStackNavigator();
  // App navigation
  const navigation = useNavigation();
  // Notification listeners references
  const notificationReceivedListener = useRef();
  const notificationResponseListener = useRef();
  // App State reference
  const previousAppState = useRef(AppState.currentState);
  // Determines if a chat is opened and visible
  const isChatOpenedAndVisible = useSelector(getChatOpenedAndVisible);
  // Current user selected room
  const userSelectedRoomID = useSelector(getSelectedRoomID);

  /**
   * Notification and Application State Listeners
   */
  useEffect(() => {
    // Attempts to get the user's permission to allow notifications
    registerForPushNotificationsAsync(dispatch);

    // Notification Received Listener
    notificationReceivedListener.current =
      Notifications.addNotificationReceivedListener((notification) =>
        notificationReceivedHandler(
          notification,
          getFullMessageFromServer,
          dispatch
        )
      );
    // Notification Response Listener
    notificationResponseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) =>
        notificationResponseHandler(
          response.notification,
          getFullMessageFromServer,
          dispatch,
          navigation
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
    };
  }, []);

  /**
   * Handles the display of the notifications when the app is in the foreground.
   * If the user is in the chat where the message received belongs to and the chat
   * is visible, then a notification won't show. Otherwise, a notification will display.
   */
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) =>
        // If the notification object has the correct data
        notification.request.content.data.roomID &&
        notification.request.content.data.messageID &&
        // If the user is in a chat and the chat is visible
        isChatOpenedAndVisible &&
        // If the user has a selected room (checks for the room's ID)
        userSelectedRoomID &&
        // If the message received belongs to the same room that's currently selected
        parseInt(notification.request.content.data.roomID) ===
          userSelectedRoomID
          ? // Doesn't display the notification
            {
              shouldShowAlert: false,
              shouldPlaySound: false,
              shouldSetBadge: true,
            }
          : // Displays the notification
            {
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
            },
    });
  }, [userSelectedRoomID, isChatOpenedAndVisible]);

  // Gordon 360 Screen
  const Gordon360Page = () => {
    return <Gordon360 />;
  };

  // Messages Screen
  const Messages = () => {
    return (
      <View style={styles.screenView}>
        <Stack.Navigator
          /**
           * Navigation gestures are disabled since there's no callback
           * for when this occurs and therefore creates a bug where important
           * logic doesn't occur when the user changes the screen with a gesture
           */
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Screen name={ScreenNames.rooms}>
            {() => (
              <View style={styles.screenView}>
                <AppBar />
                <RoomsList />
              </View>
            )}
          </Stack.Screen>
          <Stack.Screen name={ScreenNames.chat}>
            {() => (
              <View style={styles.screenView}>
                <AppBar />
                <ChatView />
              </View>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </View>
    );
  };

  const Settings = () => {
    return (
      <View style={styles.screenView}>
        <AppBar />
        <AppSettings />
      </View>
    );
  };

  // User Profile Screen
  const ProfilePage = () => {
    return (
      <View style={styles.screenView}>
        <AppBar />
        <Profile />
      </View>
    );
  };

  // Login Screen
  const LoginPage = () => {
    return (
      <View style={styles.screenView}>
        <Login />
      </View>
    );
  };

  // Returns the screen that's asked for through props
  if (props.screenName === ScreenNames.gordon360) return Gordon360Page();
  else if (props.screenName === ScreenNames.messages) return Messages(props);
  else if (props.screenName === ScreenNames.profile) return ProfilePage();
  else if (props.screenName === ScreenNames.settings) return Settings();
  else if (props.screenName === ScreenNames.login) return LoginPage();
};

const styles = StyleSheet.create({
  screenView: { flex: 1 },
});

Screen.propTypes = {
  screenName: PropTypes.string.isRequired,
};
