import React, { useEffect } from "react";
import { AppBar } from "./src/Components/AppBar";
import { View, StyleSheet, Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { Chats } from "./src/Views/Chat/Chats/index.js";
import { RoomsList } from "./src/Views/Rooms";
import { Login } from "./src/Views/Login";

// Navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Gordon 360 Screen
function Gordon360({ navigation }) {
  return (
    <View style={styles.screenView}>
      <AppBar navigation={navigation} route="Gordon_360" />
      <WebView
        style={styles.webview}
        source={{ uri: "https://360.gordon.edu" }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
      />
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
              <AppBar {...props} />
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

export default function App() {
  return (
    <View style={styles.screenView}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Login">
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
