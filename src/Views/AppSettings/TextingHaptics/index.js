import React from "react";
import { View, Text, StyleSheet, Switch, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getUseHapticsForTexting } from "../../../store/entities/Settings/settingsSelectors";
import { setHapticsForTexting } from "../../../store/entities/Settings/settings";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";

export const TextingHaptics = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // Determines if Haptics are enabled
  const hapticsEnabled = useSelector(getUseHapticsForTexting);
  // If the device is an iPhone 6S or lower, or on iOS 9 and lower, haptics are not available
  const supportHaptics = () => {
    // If the platform is ios
    if (Constants.platform.ios) {
      // If the OS version is below iOS 10
      if (parseInt(Constants.platform.ios.systemVersion) < 10) return false;
      // If the device is an iPhone and the model is the 6S or lower
      if (
        parseInt(
          Constants.platform.ios.platform
            .replace("iPhone", "")
            .replace(",", ".")
        ) < 9
      )
        return false;
    }
    return true;
  };

  /**
   * Returns the track color of the switch
   * @param {boolean} isForiOSBackgroundColor Determines if the color returned is
   * 						for the property "ios_backgroundColor" in a Switch
   * @returns
   */
  const getTrackColor = (isForiOSBackgroundColor) => {
    // The color when the switch is in a false state
    const falseColor = "#bfddff";

    // If the device is Android
    if (Platform.OS === "android")
      return { false: falseColor, true: "#bfddff" };
    // If the device is iOS
    else if (Platform.OS === "ios") {
      // If the color is for the property "ios_backgroundColor" in a Switch
      if (isForiOSBackgroundColor) return falseColor;
      // If the color is for the property "trackColor" in a Switch
      else return { false: falseColor, true: "#bfddff" };
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={props.styles.listItemTitle}>Texting Haptics</Text>
        <Switch
          onValueChange={() => {
            dispatch(setHapticsForTexting(!hapticsEnabled));
            // Sets the Haptics Type for when the user is texting
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }}
          disabled={!supportHaptics()}
          value={hapticsEnabled}
          trackColor={getTrackColor()}
          thumbColor={hapticsEnabled ? "#014983" : "white"}
          ios_backgroundColor={getTrackColor(true)}
        />
      </View>
      <Text style={styles.switchStatus}>
        {hapticsEnabled ? "Enabled" : "Disabled"}
      </Text>
      {supportHaptics() ? (
        <Text style={props.styles.listItemText}>
          Haptics is the quick vibration you feel from your device after typing
          or deleting a character with your keyboard. If your device doesn't
          have vibration, haptics may not work even when enabled.
        </Text>
      ) : (
        <Text style={props.styles.listItemText}>
          Haptics are disabled. Your device doesn't support Haptics.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  switchStatus: { color: "#e6f2ff", textAlign: "right", marginBottom: 10 },
});
