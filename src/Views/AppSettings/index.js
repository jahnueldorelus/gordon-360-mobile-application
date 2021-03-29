import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import { resetApp } from "../../Services/App/index";
import { useNavigation } from "@react-navigation/native";
import {
  NotificationIdentifiers,
  pushNotification,
} from "../../Services/Notifications/index";

export const AppSettings = () => {
  // React Native Navigation
  const navigation = useNavigation();

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
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Resetting Application",
                "Are you sure you want to reset the application? You will be required to login again.",
                [
                  {
                    text: "Reset App",
                    // Deletes data and navigates to Login page
                    onPress: () => resetApp(() => navigation.navigate("Login")),
                  },
                  {
                    text: "Cancel",
                    onPress: () => {}, // Does nothing
                    style: "cancel",
                  },
                ]
              )
            }
            style={styles.resetAllButton}
          >
            <Text style={styles.resetAllButtonText}>Reset App</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              pushNotification(
                NotificationIdentifiers.newMessage,
                "CPS Club",
                "From Samantha Loheva",
                "Hey there! How have you been?! It's been such a long time since I've seen you and I wanted to know if you wanted to link up!"
              )
            }
            style={styles.resetAllButton}
          >
            <Text style={styles.resetAllButtonText}>Push Notification</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "white" },
  safeAreaView: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: "5%" },
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
  resetAllButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#014983",
  },
});
