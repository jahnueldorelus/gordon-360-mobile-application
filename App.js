import React, { useState, useRef } from "react";
import { AppBar } from "./src/Components/AppBar";
import { Button, View, StyleSheet, Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import Chat from "./src/Views/Chat/Chat.js";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

function Gordon360({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
      <AppBar navigation={navigation} route="Messages" />
      <Chat />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Messages">
          <Drawer.Screen name="Gordon 360" component={Gordon360} />
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
