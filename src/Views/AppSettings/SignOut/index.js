import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { signOutApp } from "../../../Services/App/index";

export const SignOut = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // React Native Navigation
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <Text style={props.styles.listItemTitle}>Sign Out</Text>

      <Text style={props.styles.listItemText}>
        Log out from the app. All of your data will be erased from this device.
      </Text>
      <TouchableOpacity
        onPress={() =>
          // Deletes data and navigates to the Login page
          Alert.alert("Signing Out", "Are you sure you want to sign out?", [
            {
              text: "Sign Out",
              /**
               * Deletes all data (except for login information), retieves all the data
               * from the server and navigate to the messages screen
               */
              onPress: () =>
                signOutApp(dispatch, () => navigation.navigate("Login")),
            },
            {
              text: "Cancel",
              onPress: () => {}, // Does nothing
              style: "cancel",
            },
          ])
        }
        style={[props.styles.itemButton, { marginTop: 10 }]}
      >
        <Text style={props.styles.itemButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 15,
  },
});
