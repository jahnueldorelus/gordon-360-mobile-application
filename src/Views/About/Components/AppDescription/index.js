import React from "react";
import { View, Text, StyleSheet } from "react-native";

/**
 * The description of the app
 */
export const AppDescription = () => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.textTitle}>360 DM</Text>
      <Text style={styles.textBody}>
        As a messaging application that compliments Gordon 360, stay in touch
        with your friends and clubs by starting new group chats. Access all of
        Gordon 360 and its functionality with your credentials synced for easy
        and quick access. Much of the information you use daily at Gordon, right
        at your fingertips.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#014983",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  textTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  textBody: { color: "white", fontSize: 17, textAlign: "center" },
});
