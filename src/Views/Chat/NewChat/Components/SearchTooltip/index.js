import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export const SearchTooltip = (props) => {
  return (
    <View style={styles.tooltipContainer}>
      <Image
        source={require("../../Images/people-search.png")}
        style={styles.tooltipImage}
      />
      <Text style={styles.tooltipText}>
        {props.selectedUsers.length > 0
          ? "Select more people or click create to start a new chat!"
          : "Search and select people above to chat with!"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    flexGrow: 1,
  },
  tooltipImage: {
    width: 150,
    height: 150,
    backgroundColor: "white",
    tintColor: "#013e83",
    marginBottom: 20,
  },
  tooltipText: {
    fontSize: 20,
    color: "#014983",
    fontWeight: "bold",
    width: "80%",
    textAlign: "center",
  },
});
