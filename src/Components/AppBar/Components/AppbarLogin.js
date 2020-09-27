import React from "react";
import { View, StatusBar } from "react-native";
import { StyleSheet } from "react-native";

export const AppbarLogin = (props) => {
  return (
    <View style={styles.appBarContainer}>
      <StatusBar barStyle="default" hidden={false} translucent={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
