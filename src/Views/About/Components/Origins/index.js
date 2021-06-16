import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { data } from "./data";

/**
 * The origins of the app. This shows every person that's worked
 * on this application
 */
export const Origins = () => {
  return Object.values(data).map((developSession, index) => (
    <View key={index} style={styles.mainContainer}>
      <Text style={styles.textTitle}>{developSession.title}</Text>
      <View>
        <View style={styles.list}>
          <Text style={styles.textSubTitle}>Developers</Text>
          {developSession.developers.map((developerDescription, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.textBody}>{"- "}</Text>
              <Text key={index} style={styles.textBody}>
                {developerDescription}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.list}>
          <Text style={styles.textSubTitle}>Overseers</Text>
          {developSession.overseers.map((overseerDescription, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.textBody}>{"- "}</Text>
              <Text style={styles.textBody}>{overseerDescription}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  ));
};

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 30,
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#013e70",
    alignItems: "center",
  },
  textTitle: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    color: "white",
  },
  textSubTitle: {
    fontSize: 19,
    fontWeight: "bold",
    padding: 0,
    color: "#acdafe",
    marginHorizontal: "2%",
  },
  textBody: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
  },
  list: { marginBottom: 5 },
  listItem: {
    flexDirection: "row",
    marginHorizontal: "10%",
  },
});
