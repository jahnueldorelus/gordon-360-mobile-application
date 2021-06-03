import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { signOutApp } from "../../../Services/App/index";
import { getExpoTokenDeleted } from "../../../store/entities/Auth/authSelectors";
import {
  deleteExpoTokenFromServer,
  resetExpoTokenDeletion,
} from "../../../store/entities/Auth/auth";

export const SignOut = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // Determines if an expo token was successfully deleted from the server
  const isExpoTokenDeleted = useSelector(getExpoTokenDeleted);

  /**
   * If the expo token has been deleted from the server, the app will sign
   * out the user. Otherwise, the user will remain signed in
   */
  useEffect(() => {
    // If the token was successfully deleted from the server
    if (isExpoTokenDeleted) {
      signOutApp(dispatch);
    } else if (isExpoTokenDeleted === false) {
      /**
       * If the token failed to delete from the server
       * Don't remove the boolean "false" as that value is used to determine
       * if an attempt was made to delete the expo token from the server.
       * If the value is null, then an attempt wasn't made. Since "null" is also
       * a falsey value, a check is made specifically for "false"
       */
      Alert.alert(
        "Error Signing Out",
        "An error occured while signing you out from our server. Please make sure you're connected to the internet and try again.",
        [
          {
            text: "Cancel",
            onPress: () => {}, // Does nothing
            style: "cancel",
          },
        ]
      );
      // Resets the expo's token deletion attempt
      dispatch(resetExpoTokenDeletion());
    }
  }, [isExpoTokenDeleted]);

  return (
    <View style={styles.mainContainer}>
      <Text style={props.styles.listItemTitle}>Sign Out</Text>

      <Text style={props.styles.listItemText}>
        Log out from the app. All of your data will be erased from this device.
      </Text>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() =>
          // Deletes data and navigates to the Login page
          Alert.alert("Signing Out", "Are you sure you want to sign out?", [
            {
              text: "Sign Out",
              /**
               * Deletes all data (except for login information), retieves all the data
               * from the server and navigate to the messages screen
               */
              onPress: () => dispatch(deleteExpoTokenFromServer),
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
