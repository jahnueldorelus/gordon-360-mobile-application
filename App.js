import React, { useEffect } from "react";
import { NativeModules, Platform, View, StyleSheet } from "react-native";
import { NetworkProvider } from "react-native-offline";
import { store, persistor } from "./src/store/configuration/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef, isReadyRef } from "./src/Services/Navigation/index";
import { Start } from "./start";

export default function App() {
  // This enables LayoutAnimation for Android
  if (Platform.OS === "android") {
    const { UIManager } = NativeModules;
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // Sets the navigation as not ready since it hasn't been loaded yet
  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <NetworkProvider pingServerUrl="https://360train.gordon.edu">
          <View style={styles.screenView}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                // Sets the navigation as ready since it has loaded
                isReadyRef.current = true;
              }}
            >
              <Start />
            </NavigationContainer>
          </View>
        </NetworkProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  screenView: { flex: 1 },
});
