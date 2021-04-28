import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { resetApp, fetchAllAppData } from "../../../Services/App/index";

export const ResetApp = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // React Native Navigation
  const navigation = useNavigation();

  return (
    <View
      style={[
        props.styles.itemContainer,
        {
          backgroundColor: "#015f83",
        },
      ]}
    >
      <View style={props.styles.itemTextAndIconContainer}>
        <View style={props.styles.itemIconContainer}>
          <Icon
            name="undo-alt"
            type="font-awesome-5"
            color="#015f83"
            size={40}
            containerStyle={props.styles.itemIcon}
          />
        </View>
        <View style={props.styles.itemTextContainer}>
          <Text style={props.styles.itemTextTitle}>App Reset</Text>
          <Text style={props.styles.itemTextDate}>
            If the application appears to be non-functional or has some
            glitches, a reset may possibly fix the issue. You will not be signed
            out. After the app has reset, your data will be retrieved from our
            servers.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            "Resetting Application",
            "Are you sure you want to reset the application?",
            [
              {
                text: "Reset App",
                /**
                 * Deletes all data (except for login information), retieves all the data
                 * from the server and navigate to the messages screen
                 */
                onPress: () =>
                  resetApp(dispatch, () =>
                    fetchAllAppData(dispatch, navigation.navigate("Gordon 360"))
                  ),
              },
              {
                text: "Cancel",
                onPress: () => {}, // Does nothing
                style: "cancel",
              },
            ]
          )
        }
        style={props.styles.itemButton}
      >
        <Text style={[props.styles.itemButtonText, { color: "#074f87" }]}>
          Reset App
        </Text>
      </TouchableOpacity>
    </View>
  );
};
