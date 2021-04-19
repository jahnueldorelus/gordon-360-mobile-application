import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { resetApp } from "../../../Services/App/index";

export const ResetApp = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // React Native Navigation
  const navigation = useNavigation();

  return (
    <View
      style={[
        props.styles.statusContainer,
        {
          backgroundColor: "#015f83",
        },
      ]}
    >
      <View style={props.styles.statusTextAndIconContainer}>
        <View style={props.styles.statusIconContainer}>
          <Icon
            name="undo-alt"
            type="font-awesome-5"
            color="#074f87"
            size={40}
            containerStyle={props.styles.statusIcon}
          />
        </View>
        <View style={props.styles.statusTextContainer}>
          <Text style={props.styles.statusTextTitle}>App Reset</Text>
          <Text style={props.styles.statusTextDate}>
            If the application appears to be non-functional or has some
            glitches, a reset may possibly fix the issue.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            "Resetting Application",
            "Are you sure you want to reset the application? You will be required to login again.",
            [
              {
                text: "Reset App",
                // Deletes data and navigates to Login page
                onPress: () =>
                  resetApp(dispatch, () => navigation.navigate("Login")),
              },
              {
                text: "Cancel",
                onPress: () => {}, // Does nothing
                style: "cancel",
              },
            ]
          )
        }
        style={props.styles.statusCheckerButton}
      >
        <Text
          style={[props.styles.statusCheckerButtonText, { color: "#074f87" }]}
        >
          Reset App
        </Text>
      </TouchableOpacity>
    </View>
  );
};
