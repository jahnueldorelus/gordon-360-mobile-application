import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

export const AppbarRoom = (props) => {
  return (
    <View style={styles.appBarContainer}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.openDrawer();
        }}
        style={styles.navigationButton}
      >
        <Icon name="bars" type="font-awesome-5" color="white" size={28} />
        <Text style={styles.navigationButtonText}>Messages</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  appBarContainer: { flexDirection: "row", alignItems: "center" },
  navigationButton: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  navigationButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
