import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import { getDeviceOrientation } from "../../store/ui/app";
import { useSelector } from "react-redux";
import { AppDescription } from "./Components/AppDescription";
import { Origins } from "./Components/Origins";

export const About = (props) => {
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);

  return (
    <ScrollView
      style={styles.scrollView}
      /**
       * Scroll indicator prevents glitch with scrollbar appearing
       * in the middle of the screen
       */
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View
        style={[
          styles.safeArea,
          {
            paddingHorizontal: screenOrientation === "landscape" ? "10%" : "5%",
          },
        ]}
      >
        <View style={styles.headerContainer}>
          <Icon
            name="clipboard-list"
            type="font-awesome-5"
            color={"#013e70"}
            size={75}
          />
          <Text style={styles.headerText}>About</Text>
        </View>
        {/* Description of the app */}
        <AppDescription />

        {/* Teams that worked on this project */}
        <Origins />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, paddingHorizontal: "5%", backgroundColor: "white" },
  safeArea: { flex: 1 },
  headerContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  headerText: {
    color: "#014983",
    fontSize: 30,
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
