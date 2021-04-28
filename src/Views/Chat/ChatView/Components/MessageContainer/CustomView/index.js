import React from "react";
import { View, Text } from "react-native";

/**
 * Occupies the space in the message bubble before the time
 * and ticks are shown.
 * @param {JSON} user The main user
 */
export const renderCustomView = (props) => (
  <View style={{ minHeight: 20, alignItems: "center", borderWidth: 1 }}>
    <Text>This box is the Custom View</Text>
  </View>
);
