import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { ResetApp } from "./ResetApp/index";
import { Status360 } from "./Status360/index";
import { StatusServer } from "./StatusServer/index";
import { TextingHaptics } from "./TextingHaptics/index";
import { SignOut } from "./SignOut/index";
import { ListDivider } from "./ListDivider/index";
import { getDeviceOrientation } from "../../store/ui/app";
import { useSelector } from "react-redux";

export const AppSettings = () => {
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
          styles.mainContainer,
          {
            paddingHorizontal: screenOrientation === "landscape" ? "10%" : 0,
          },
        ]}
      >
        <View style={styles.headerContainer}>
          <Icon name="cogs" type="font-awesome-5" color={"#013e70"} size={75} />
          <Text style={styles.headerText}>App Settings</Text>
        </View>

        <ResetApp styles={itemStyles} />

        <Status360 styles={itemStyles} />

        <StatusServer styles={itemStyles} />

        <View
          style={[
            listStyles.listContainer,
            { borderRadius: itemStyles.itemContainer.borderRadius },
          ]}
        >
          <TextingHaptics styles={listStyles} />
          <ListDivider />
          <SignOut styles={listStyles} />
        </View>
      </View>
    </ScrollView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: "5%", backgroundColor: "white" },
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

// Button styles for the component
const buttonStyles = StyleSheet.create({
  itemButton: {
    backgroundColor: "white",
    alignSelf: "flex-end",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  itemButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#354f86",
  },
});

// Style for singular items
const itemStyles = StyleSheet.create({
  ...buttonStyles,
  itemContainer: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    marginVertical: 10,
  },
  itemTextAndIconContainer: { flexDirection: "row", marginBottom: 10 },
  itemIconContainer: {
    marginRight: 20,
  },
  itemIcon: {
    marginTop: 5,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
  },
  itemTextContainer: { flex: 1 },
  itemTextTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemTextDate: {
    color: "white",
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "normal",
  },
  itemTextDateBold: { fontWeight: "bold" },
  itemTextCurrentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTextCurrent: { color: "white", fontSize: 15, fontWeight: "bold" },
});

// Styles for the list of items
const listStyles = StyleSheet.create({
  ...buttonStyles,
  listContainer: {
    marginVertical: 20,
    padding: 15,
    paddingBottom: 5,
    borderWidth: 1,
    backgroundColor: "#013e70",
  },
  listItemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  listItemText: { color: "#e6f2ff", fontSize: 15, marginTop: 5 },
});
