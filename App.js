import React, { useState, useRef } from "react";
import { AppBar } from "./src/Components/AppBar";
import { Button, View, StyleSheet, Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import Chat from "./src/Views/Chat/Chat.js";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <AppBar navigation={navigation} />
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

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={navigation.openDrawer} title="Open navigation drawer" />
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

function Messages({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <AppBar navigation={navigation} />
      <Chat />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  // A reference to the navigation container
  const navigationRef = useRef();

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          // Sets the name of the current screen view
          setPath(navigationRef.current.getCurrentRoute().name);
        }}
        onStateChange={() => {
          // Sets the name of the current screen view
          setPath(navigationRef.current.getCurrentRoute().name);
        }}
      >
        <Drawer.Navigator initialRouteName="Messages">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Notifications" component={NotificationsScreen} />
          <Drawer.Screen name="Messages" component={Messages} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "black",
    width: deviceWidth,
    height: deviceHeight,
  },
});
