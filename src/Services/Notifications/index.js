import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Navigation from "../Navigation/index";
import { apiRequested } from "../../store/middleware/api";
import { setExpoToken } from "../../store/entities/Auth/auth";

// Notification Category Identifier
export const NotificationType = {
  newMessage: "new_message",
};

/**
 * Handles the display of the notifications when the app is in the foreground.
 * If the user is in a chat where a message is received, a notification won't show.
 * Otherwise, a notification will display.
 */
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return isChatMessageAndUserInChat(notification)
      ? {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }
      : {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: true,
        };
  },
});

/**
 * Handles all notifications received
 * @param {object} notification The notification received
 * @param {Function} getFullMessageFromServer Function that fetches the full message object
 * @param {*} dispatch Redux dispatch
 */
export const notificationReceivedHandler = async (
  notification,
  getFullMessageFromServer,
  dispatch
) => {
  // List of notifications in the notification tray
  let notificationTray = await Notifications.getPresentedNotificationsAsync();
  // The full message object is fetched from the server
  dispatch(getFullMessageFromServer(notification.request), notificationTray);
};

/**
 * Handles all notifications responded to
 * @param {object} notification The notification received
 * @param {Function} getFullMessageFromServer Function that fetches the full message object
 * @param {*} dispatch Redux dispatch
 */
export const notificationResponseHandler = async (
  notification,
  getFullMessageFromServer,
  dispatch
) => {
  // If the notification is for a chat, the user is brought to the specified chat
  if (notification.request.content.data.roomID) {
    Navigation.navigateToChat(
      dispatch,
      notification.request.content.data.roomID
    );
    // List of notifications in the notification tray
    let notificationTray = await Notifications.getPresentedNotificationsAsync();
    // The full message object is fetched from the server
    dispatch(getFullMessageFromServer(notification.request), notificationTray);
  }
};

/**
 * Handles getting all of the notifications that wasn't
 * responded to while the app wasn't in the foreground
 * @param {object} previousAppState Reference to the previous app state
 * @param {string} nextAppState The new app state
 * @param {Function} getFullMessageFromServer Function that fetches the full message object
 * @param {*} dispatch Redux dispatch
 */
export const handleAppStateChange = async (
  previousAppState,
  nextAppState,
  getFullMessageFromServer,
  dispatch
) => {
  /**
   * Checks to see if the app is returning to the foreground.
   * If so, if there are any push notification(s) that have not been
   * processed, the full message object(s) are fetched from the back-end
   */
  if (
    previousAppState.current.match(/inactive|background/) &&
    nextAppState === "active"
  ) {
    // List of notifications in the notification tray
    let notificationTray = await Notifications.getPresentedNotificationsAsync();
    // For each presented notification, it's full message object is fetched from the server
    notificationTray.forEach((notification) => {
      dispatch(
        getFullMessageFromServer(notification.request),
        notificationTray
      );
    });
  }

  // Sets the new previous app state the same as the current
  previousAppState.current = nextAppState;
};

/**
 * Sets the new Expo's token
 * @param {string} token The new Expo token
 * @param {*} dispatch Redux dispatch
 */
export const setNewToken = (token, dispatch) => {
  // Sends the user's Expo Token to the back-end
  dispatch(
    apiRequested({
      url: "/dm/REPLACE_ENDPOINT",
      method: "put",
      data: { token },
      useEndpoint: true,
    })
  );
  // Saves the user's Expo token
  dispatch(setExpoToken(token));
};

/**
 * Registers for the device to receive push notifications.
 * Permission is asked from the user to receive notifications.
 * If permission is denied, the user has to go to the settings of the app
 * inside of the device's Settings to enable notifications.
 *
 * @param {*} dispatch Redux dispatch
 */
export const registerForPushNotificationsAsync = async (dispatch) => {
  // Checks to make sure that a physical device is being used since
  // push notifications don't work on emulators and simulators
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    /**
     * Checks to see if notification permissions are allowed. If not,
     * permissions are asked.
     */
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    // If permission was still denied after permission was asked
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    // Get's a token from Expo to do Push Notifications with Expo's server
    const token = await (await Notifications.getExpoPushTokenAsync()).data;
    // Sends the user's Expo Token to the back-end
    // dispatch(
    //   apiRequested({
    //     url: "/dm/REPLACE_ENDPOINT",
    //     method: "put",
    //     data: { token },
    //     useEndpoint: true,
    //   })
    // );
    // Saves the user's Expo token
    dispatch(setExpoToken(token));
  }
  // If the device is not a real device, push notifications may be disabled
  else {
    alert("Must use physical device for Push Notifications");
  }

  // Creates a notification channel for Android as this is required
  // for push notifications ever since Android 8.0
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

/**
 * Determines if a notification should appear.
 * If a notification is received for a chat that the user
 * is already in, no notification will appear. Otherwise, a notification
 * will display.
 */
const isChatMessageAndUserInChat = (notification) =>
  notification.request.content.data.roomID &&
  notification.request.content.data.messageID &&
  Navigation.getNavigationRoute().name === "Chat" &&
  Navigation.getNavigationRoute().params.roomID &&
  notification.request.content.data.roomID ===
    Navigation.getNavigationRoute().params.roomID
    ? false
    : true;
