import React, { useRef, useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image } from "react-native";
import { CustomModal } from "../../Components/CustomModal";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-community/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { CustomLoader } from "../../Components/CustomLoader";
import { AppBar } from "../../Components/AppBar";

export const Gordon360 = (props) => {
  const web = useRef(null);
  let styles = StyleSheet.create({
    screenView: { flex: 1 },
    modalView: {
      backgroundColor: "#012849",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      flexDirection: "row",
    },
    modalViewText: { color: "white", fontSize: 20 },
    modalViewImage: {
      tintColor: "white",
      width: 32,
      height: 32,
      marginLeft: 20,
    },
  });

  const [token, setToken] = useState(null);
  const [networkConnected, setNetworkConnected] = useState(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  /**
   * Creates an event listener for the network and saves the user's token
   */
  useEffect(() => {
    // Saves the user's token
    getToken();

    // Network event listener
    const networkListener = NetInfo.addEventListener((state) => {
      setNetworkConnected(
        state.isConnected && state.isInternetReachable !== null
          ? state.isInternetReachable
          : true
      );
    });

    // Removes the network listener. Syntax may be weird but it's the
    // correct way according to documentation
    return networkListener();
  }, []);

  // Gets the user's token
  async function getToken() {
    setToken(JSON.parse(await AsyncStorage.getItem("token")));
  }
  if (token && networkConnected)
    return (
      <View style={styles.screenView}>
        <AppBar
          navigation={props.navigation}
          route="Gordon_360"
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
            content={
              <SafeAreaView style={styles.modalView}>
                <Text style={styles.modalViewText}>No Internet Connection</Text>
                <Image
                  style={styles.modalViewImage}
                  source={require("./Images/wifi_disconnected.png")}
                />
              </SafeAreaView>
            }
            visible={!token || !networkConnected}
            coverScreen
            containInView
            height={11}
          />
        </View>
      </View>
    );
  else return <CustomLoader />;
};
