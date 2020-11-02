import React, { useEffect, useState } from "react";
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
import { WebView } from "react-native-webview";
import { Chats } from "./src/Views/Chat/Chats/index.js";
import { RoomsList } from "./src/Views/Rooms";
import { Login } from "./src/Views/Login";
import { Offline360 } from "./src/Views/Offline360";
import AsyncStorage from "@react-native-community/async-storage";

export default function App() {
  // Navigators
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();

  // This enables LayoutAnimation for Android
  if (Platform.OS === "android") {
    const { UIManager } = NativeModules;
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // Gordon 360 Screen
  function Gordon360({ navigation }) {
    const [token, setToken] = useState(null);

    /**
     * Gets the user's token from storage
     */
    useEffect(() => {
      async function getToken() {
        setToken(JSON.parse(await AsyncStorage.getItem("token")));
      }

      getToken();
    }, []);

    if (token) {
      return (
        <View style={styles.screenView}>
          {/* <AppBar navigation={navigation} route="Gordon_360" />
          <WebView
            javaScriptEnabled={true}
            domStorageEnabled={true}
            // Adds the token to the WebView's local storage to enable automatic sign in on 360
            injectedJavaScriptBeforeContentLoaded={`window.localStorage.setItem('token', '"${token}"');`}
            source={{ uri: "https://360.gordon.edu" }}
            onMessage={(event) => {
              console.log("event: ", event);
            }}
          /> */}
          <AppBar navigation={navigation} route="Gordon_360_Offline" />
          <Offline360 />
        </View>
      );
    } else return <></>;
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
                <Chats {...props} />
              </View>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </View>
    );
  }

  function LoginPage({ navigation }) {
    useEffect(() => {}, []);
    return (
      <View style={styles.screenView}>
        <AppBar navigation={navigation} route="Login" />
        <Login navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.screenView}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Gordon 360">
          <Drawer.Screen name="Gordon 360" component={Gordon360} />
          <Drawer.Screen name="Messages" component={Messages} />
          <Drawer.Screen
            name="Login"
            component={LoginPage}
            /**
             * Uncomment later, but this will be used to prevent users on
             * iOS from accessing the drawer navigator using gestures
             */
            options={{ gestureEnabled: false }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
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
