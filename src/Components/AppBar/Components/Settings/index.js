import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export const AppbarSettings = () => {
  // React Native Navigation
  const navigation = useNavigation();

  return (
    <View style={styles.appBarContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.openDrawer();
        }}
        style={styles.navigationButton}
      >
        <Icon name="bars" type="font-awesome-5" color="white" size={28} />
        <Text style={styles.navigationButtonText}>Settings</Text>
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
  navigationButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  newChat: { marginRight: 10 },
});
