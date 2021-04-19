import React from "react";
import { View, StyleSheet } from "react-native";

export const ListDivider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  divider: { borderBottomWidth: 1, borderColor: "white" },
});
