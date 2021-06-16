import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { CustomModal } from "../../../../Components/CustomModal";
import { Button, Icon } from "react-native-elements";

export const OfflineMessage = (props) => {
  const [minViewWidth, setMinViewWidth] = useState(0);
  return (
    <CustomModal
      content={
        <ScrollView
        /**
         * Scroll indicator prevents glitch with scrollbar appearing
         * in the middle of the screen
         */
          scrollIndicatorInsets={{ right: 1 }}
        >
          <SafeAreaView style={styles.screenView}>
            <View style={styles.modalView}>
              <View
                style={[
                  styles.modalViewContainer,
                  styles.modalViewContainerOne,
                  { minWidth: minViewWidth !== 0 ? minViewWidth : "auto" },
                ]}
                onLayout={({ nativeEvent }) => {
                  let newWidth = nativeEvent.layout.width;
                  if (minViewWidth === 0 || minViewWidth < newWidth)
                    setMinViewWidth(newWidth);
                }}
              >
                <Icon
                  containerStyle={styles.modalViewImage}
                  type="material"
                  name="perm-scan-wifi"
                  size={60}
                  color="white"
                />
                <Text style={[styles.modalViewText, styles.modalViewTextTitle]}>
                  Uh-oh, it appears you're offline!
                </Text>
                <Text style={[styles.modalViewText, styles.modalViewTextHelp]}>
                  To view Gordon 360, please re-connect to the internet.
                </Text>
              </View>
              <View
                style={[
                  styles.modalViewContainer,
                  styles.modalViewContainerTwo,
                  { minWidth: minViewWidth !== 0 ? minViewWidth : "auto" },
                ]}
                onLayout={({ nativeEvent }) => {
                  let newWidth = nativeEvent.layout.width;
                  if (minViewWidth === 0 || minViewWidth < newWidth)
                    setMinViewWidth(newWidth);
                }}
              >
                <Icon
                  containerStyle={styles.modalViewImage}
                  type="material"
                  name="account-circle"
                  size={60}
                  color="white"
                />
                <Text style={[styles.modalViewText, styles.modalViewTextTitle]}>
                  While 360 is unavailable, you may still view your personal
                  information in your profile.
                </Text>
                <Text style={styles.modalViewText}>
                  Tap below to view your profile.
                </Text>
                <Button
                  buttonStyle={styles.modalViewButtonProfile}
                  title="My Profile"
                  onPress={() => {
                    props.navigation.navigate("Profile");
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      }
      visible={!props.isConnected}
      coverScreen
      containInView
      height={100}
    />
  );
};

let styles = StyleSheet.create({
  screenView: { flex: 1 },
  modalView: {
    justifyContent: "center",
    padding: 30,
  },
  modalViewContainer: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
    alignSelf: "center",
  },
  modalViewContainerOne: {
    backgroundColor: "#012849",
  },
  modalViewContainerTwo: {
    backgroundColor: "#013E70",
  },
  modalViewText: { color: "white", fontSize: 20, textAlign: "center" },
  modalViewTextTitle: { marginBottom: 25 },
  modalViewTextHelp: { marginBottom: 15 },
  modalViewImage: {
    tintColor: "#d3ebff",
    marginBottom: 10,
  },
  modalViewButtonProfile: {
    borderWidth: 1,
    borderColor: "#012849",
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 5,
    paddingHorizontal: 15,
    alignSelf: "center",
  },
});
