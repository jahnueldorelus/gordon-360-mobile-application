import React from "react";
import { NativeModules, Platform, View, StyleSheet } from "react-native";
import { store, persistor } from "./src/store/configuration/configureStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { Start } from "./start";

export default function App() {
  // This enables LayoutAnimation for Android
  if (Platform.OS === "android") {
    const { UIManager } = NativeModules;
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <View style={styles.screenView}>
          <NavigationContainer>
            <Start />
          </NavigationContainer>
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  screenView: { flex: 1 },
});
