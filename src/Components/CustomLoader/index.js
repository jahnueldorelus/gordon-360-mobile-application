import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

export const CustomLoader = () => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#014983" />
      <Text style={styles.loaderText}>Loading, please wait...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  loaderText: {
    fontSize: 20,
    color: "#014983",
    textAlign: "center",
    marginTop: 20,
  },
});
