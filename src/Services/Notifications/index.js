import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform, Vibration } from "react-native";

// Notification Category Identifier
export const NotificationIdentifiers = {
  newMessage: "new_message",
  calendarEvent: "cal_event",
};

/**
 * Handles the display of the notifications
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Sets the notification options for the new message identifier
 */
Notifications.setNotificationCategoryAsync(NotificationIdentifiers.newMessage, [
  {
    identifier: NotificationIdentifiers.newMessage + "_response",
    buttonTitle: "Respond",
    textInput: {
      submitButtonTitle: "Send",
      placeholder: "Type your message...",
    },
  },
]);

/**
 * Handles all notifications received
 * @param {object} notification
 */
export const notificationReceivedHandler = (notification) => {
  Vibration.vibrate();
  console.log(notification);
};

/**
 * Handles all notifications responded to
 * @param {object} response
 */
export const notificationResponseHandler = (response) => {
  console.log(response);
};

/**
 * Creates a push notification
 * @param {string} identifier The identifier
 * @param {string} title The title of the notification
 * @param {string} subtitle The subtitle of the notification
 * @param {string} body The body of the notification
 * @param {*} data The data to be passed along with the notification (not displayed on UI)
 */
export async function pushNotification(
  identifier,
  title,
  subtitle,
  body,
  data
) {
  // Checks to make sure there's a title and body. Data is not required
  if (identifier && title && body)
    await Notifications.scheduleNotificationAsync({
      content: {
        categoryIdentifier: identifier,
        title,
        subtitle,
        body,
        data,
      },
      trigger: { seconds: 1 }, // The time interval must be greater than 0
    });
}

/**
 * Registers for the device to receive push notifications.
 * Permission is asked from the user to receive notifications.
 * If permission is denied, the user has to go to the settings of the app
 * inside of the device's Settings to enable notifications.
 */
export async function registerForPushNotificationsAsync() {
  // Checks to make sure that a physical device is being used since
  // push notifications don't work on emulators and simulators
  if (Constants.isDevice) {
    const { status, ios } = await Notifications.getPermissionsAsync();

    // Checks to see if notification permissions are allowed
    if (
      //   (Platform.OS === "ios" &&
      //     ios.status === Notifications.IosAuthorizationStatus.AUTHORIZED) ||
      //   status !== "granted"
      true
    ) {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: true,
          provideAppNotificationSettings: true,
          allowAnnouncements: true,
        },
      });
      if (status !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    }
  } else {
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
}
