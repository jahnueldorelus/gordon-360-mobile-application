import React, { useEffect, useState, useRef } from "react";
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
import NetInfo from "@react-native-community/netinfo";
import { CustomModal } from "./src/Components/CustomModal";

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
    const [networkConnected, setNetworkConnected] = useState(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [showOffline, setShowOffline] = useState(false);
    const web = useRef(null);

    /**
     * Saves the user's token
     */
    useEffect(() => {
      getToken();
    }, []);

    /**
     * Creates an event listener for the network
     */
    useEffect(() => {
      const networkListener = NetInfo.addEventListener((state) => {
        console.log(state);
        setNetworkConnected(state.isConnected && state.isInternetReachable);
      });

      // Removes the network listener. Syntax may be weird but it's the
      // correct way according to documentation
      return networkListener();
    }, []);

    // Gets the user's token
    async function getToken() {
      setToken(JSON.parse(await AsyncStorage.getItem("token")));
    }

    if (token && networkConnected) {
      return (
        <View style={styles.screenView}>
          <AppBar
            navigation={navigation}
            route="Gordon_360"
            showOffline={showOffline}
            setShowOffline={setShowOffline}
            web={web}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
          />
          <View style={styles.screenView}>
            <WebView
              ref={web}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              // Adds the token to the WebView's local storage to enable automatic sign in on 360
              injectedJavaScriptBeforeContentLoaded={`window.localStorage.setItem('token', '"${token}"');`}
              source={{ uri: "https://360.gordon.edu" }}
              onMessage={(event) => {
                console.log("event: ", event);
              }}
              bounces={false}
              onNavigationStateChange={(navState) => {
                setCanGoBack(navState.canGoBack);
                setCanGoForward(navState.canGoForward);
              }}
            />
            <CustomModal
              content={<Offline360 />}
              visible={showOffline}
              coverScreen
              containInView
              height={100}
            />
          </View>
        </View>
      );
    } else
      return (
        <View style={styles.screenView}>
          <AppBar
            navigation={navigation}
            route="Gordon_360_Offline"
            setNetworkConnected={setNetworkConnected}
            web={web}
          />
          <Offline360 />
        </View>
      );
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
        <Drawer.Navigator initialRouteName="Messages">
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
