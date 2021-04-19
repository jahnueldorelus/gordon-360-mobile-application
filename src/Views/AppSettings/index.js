import React from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { ResetApp } from "./ResetApp/index";
import { Status360 } from "./Status360/index";
import { StatusServer } from "./StatusServer/index";
import { TextingHaptics } from "./TextingHaptics/index";
import { SignOut } from "./SignOut/index";
import { ListDivider } from "./ListDivider/index";

export const AppSettings = () => {
  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Icon
              name="cogs"
              type="font-awesome-5"
              color={"#013e70"}
              size={75}
            />
            <Text style={styles.headerText}>App Settings</Text>
          </View>

          {/* RESET APP */}
          <ResetApp styles={styles} />

          {/* GORDON 360 WEBSITE */}
          <Status360 styles={styles} />

          {/* GORDON 360 SERVER */}
          <StatusServer styles={styles} />

          <View
            style={[
              styles.listContainer,
              { borderRadius: styles.statusContainer.borderRadius },
            ]}
          >
            {/* TEXTING HAPTICS */}
            <TextingHaptics styles={styles} />
            <ListDivider />
            {/* <SignOut /> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "white" },
  safeAreaView: { flex: 1, backgroundColor: "black" },
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
  resetAllButton: {
    borderWidth: 2,
    borderColor: "#014983",
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  statusContainer: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    marginVertical: 10,
  },
  statusTextAndIconContainer: { flexDirection: "row", marginBottom: 10 },
  statusIconContainer: {
    marginRight: 20,
  },
  statusIcon: {
    marginTop: 5,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
  },
  statusTextContainer: { flex: 1 },
  statusTextTitle: {
    color: "white",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusTextDate: {
    color: "white",
    fontSize: 17,
    marginBottom: 5,
    fontWeight: "normal",
  },
  statusTextDateBold: { fontWeight: "bold" },
  statusTextCurrent: { color: "white", fontSize: 15, fontWeight: "bold" },
  statusCheckerButton: {
    backgroundColor: "white",
    alignSelf: "flex-end",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  statusCheckerButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  statusTextCurrentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listContainer: {
    marginVertical: 20,
    padding: 15,
    borderWidth: 1,
    backgroundColor: "#013e83",
  },
  listItemTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  listItemText: {},
});
