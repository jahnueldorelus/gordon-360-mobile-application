import React from "react";
import { View, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export const AppbarProfile = (props) => {
  return (
    <View style={styles.appBarContainer}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.openDrawer();
        }}
        style={styles.navigationButton}
      >
        <Image
          style={styles.navigationButtonImage}
          source={require("../Images/hamburger_menu.png")}
        />
        <Text style={styles.navigationButtonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navigationButton: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  navigationButtonImage: {
    width: 32,
    height: 32,
    tintColor: "white",
  },
  navigationButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
