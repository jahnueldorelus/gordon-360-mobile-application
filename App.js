import React, { useEffect } from "react";
import { AppBar } from "./src/Components/AppBar";
import {
  View,
  StyleSheet,
  Dimensions,
  NativeModules,
  Platform,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ChatView } from "./src/Views/Chat/ChatView";
import { RoomsList } from "./src/Views/Rooms";
import { Login } from "./src/Views/Login";
import { AppSettings } from "./src/Views/AppSettings";
import { Profile } from "./src/Views/Profile";
import { Gordon360 } from "./src/Views/Gordon360";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NetworkProvider } from "react-native-offline";
import { store, persistor } from "./src/store/configuration/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  registerForPushNotificationsAsync,
  notificationResponseHandler,
  notificationReceivedHandler,
} from "./src/Services/Notifications/index";
import * as Notifications from "expo-notifications";

export default function App() {
  // Navigators
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();

  // This enables LayoutAnimation for Android
  if (Platform.OS === "android") {
    const { UIManager } = NativeModules;
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  /**
   * Notification Listeners
   */
  useEffect(() => {
    // Attempts to get the user's permission to allow notifications
    registerForPushNotificationsAsync();

    // Notification Received Listener
    const notificationReceivedListener = Notifications.addNotificationReceivedListener(
      (notification) => notificationReceivedHandler(notification)
    );
    // Notification Response Listener
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => notificationResponseHandler(response)
    );

    // Removes the notification listeners
    return () => {
      notificationReceivedListener.remove();
      notificationResponseListener.remove();
    };
  }, []);

  // Gordon 360 Screen
  function Gordon360Page({ navigation }) {
    return <Gordon360 navigation={navigation} />;
  }

  // Messages Screen
  function Messages() {
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
  }

  function Settings({ navigation }) {
    return (
      <View style={styles.screenView}>
        <AppBar navigation={navigation} />
        <AppSettings />
      </View>
    );
  }

  // User Profile Screen
  function ProfilePage({ navigation }) {
    return (
      <View style={styles.screenView}>
        <AppBar navigation={navigation} route="Profile" />
        <Profile />
      </View>
    );
  }

  // Login Screen
  function LoginPage({ navigation }) {
    return (
      <View style={styles.screenView}>
        <Login navigation={navigation} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <NetworkProvider pingServerUrl="https://360train.gordon.edu">
          <SafeAreaProvider>
            <View style={styles.screenView}>
              <NavigationContainer>
                <Drawer.Navigator
                  initialRouteName="Messages"
                  drawerType="slide"
                >
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
              </NavigationContainer>
            </View>
          </SafeAreaProvider>
        </NetworkProvider>
      </PersistGate>
    </Provider>
  );
}

// Get's the dimensions of the devices's screen
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "black",
    width: deviceWidth,
    height: deviceHeight,
  },
  screenView: { flex: 1 },
});
