import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { CustomModal } from "../../../../Components/CustomModal";
import { Button, Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

export const OfflineMessage = (props) => {
  return (
    <CustomModal
      content={
        <ScrollView showsVerticalScrollIndicator>
          <SafeAreaView style={styles.screenView}>
            <View style={styles.modalView}>
              <View
                style={[
                  styles.modalViewContainer,
                  styles.modalViewContainerOne,
                ]}
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
                <Text style={styles.modalViewText}>
                  To view Gordon 360, please establish an internet connection.
                </Text>
              </View>
              <View
                style={[
                  styles.modalViewContainer,
                  styles.modalViewContainerTwo,
                ]}
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
  modalViewImage: {
    tintColor: "#d3ebff",
    marginBottom: 10,
  },
  modalViewButtonProfile: {
    borderWidth: 1,
    borderColor: "#012849",
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 15,
    alignSelf: "center",
  },
});
