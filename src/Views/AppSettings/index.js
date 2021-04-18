import React, { useEffect } from "react";
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
import {
  fetchGordon360SiteStatus,
  fetchGordon360ServerStatus,
} from "../../store/entities/Settings/settings";
import {
  get360ServerLastCheckedDate,
  get360ServerStatus,
  get360SiteLastCheckedDate,
  get360SiteStatus,
} from "../../store/entities/Settings/settingsSelectors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

export const AppSettings = () => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // React Native Navigation
  const navigation = useNavigation();

  // Gordon 360 Website status
  const status360Site = useSelector(get360SiteStatus);
  // Gordon 360 Website last checked date
  const lastChecked360Site = useSelector(get360SiteLastCheckedDate);

  // Gordon 360 Server status
  const status360Server = useSelector(get360ServerStatus);
  // Gordon 360 Server last checked date
  const lastChecked360Server = useSelector(get360ServerLastCheckedDate);

  useEffect(() => {
    // Fetches the status of Gordon's 360's website and server
    dispatch(fetchGordon360SiteStatus);
    dispatch(fetchGordon360ServerStatus);
  }, []);

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
          <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: "#074f87",
              },
            ]}
          >
            <View style={styles.statusTextAndIconContainer}>
              <View style={styles.statusIconContainer}>
                <Icon
                  name="undo-alt"
                  type="font-awesome-5"
                  color="#074f87"
                  size={40}
                  containerStyle={styles.statusIcon}
                />
              </View>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTextTitle}>App Reset</Text>
                <Text style={styles.statusTextDate}>
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
              style={styles.statusCheckerButton}
            >
              <Text
                style={[styles.statusCheckerButtonText, { color: "#074f87" }]}
              >
                Reset App
              </Text>
            </TouchableOpacity>
          </View>

          {/* GORDON 360 WEBSITE */}
          <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: "#224d85",
              },
            ]}
          >
            <View style={styles.statusTextAndIconContainer}>
              <View style={styles.statusIconContainer}>
                <Icon
                  name="web"
                  type="material-5"
                  color="#224d85"
                  size={40}
                  containerStyle={styles.statusIcon}
                />
              </View>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTextTitle}>Gordon 360 Site</Text>
                <Text
                  style={[styles.statusTextDate, styles.statusTextDateBold]}
                >
                  {"Last Checked: "}
                  <Text style={styles.statusTextDate}>
                    {lastChecked360Site
                      ? lastChecked360Site
                      : "No Previous Date"}
                  </Text>
                </Text>
                {lastChecked360Site && (
                  <View style={styles.statusTextCurrentContainer}>
                    <Icon
                      name="circle"
                      solid={true}
                      type="font-awesome-5"
                      color={status360Site ? "green" : "red"}
                      size={12}
                      containerStyle={{ marginRight: 5 }}
                    />
                    <Text style={styles.statusTextCurrent}>
                      {status360Site ? "Online" : "Offline"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => dispatch(fetchGordon360SiteStatus)}
              style={styles.statusCheckerButton}
            >
              <Text
                style={[styles.statusCheckerButtonText, { color: "#224d85" }]}
              >
                Check Status
              </Text>
            </TouchableOpacity>
          </View>

          {/* GORDON 360 SERVER */}
          <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: "#354f86",
              },
            ]}
          >
            <View style={styles.statusTextAndIconContainer}>
              <View style={styles.statusIconContainer}>
                <Icon
                  name="server"
                  type="font-awesome-5"
                  color="#354f86"
                  size={40}
                  containerStyle={styles.statusIcon}
                />
              </View>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTextTitle}>Gordon 360 Server</Text>
                <Text
                  style={[styles.statusTextDate, styles.statusTextDateBold]}
                >
                  {"Last Checked: "}
                  <Text style={styles.statusTextDate}>
                    {lastChecked360Server
                      ? lastChecked360Server
                      : "No Previous Date"}
                  </Text>
                </Text>
                {lastChecked360Server && (
                  <View style={styles.statusTextCurrentContainer}>
                    <Icon
                      name="circle"
                      solid={true}
                      type="font-awesome-5"
                      color={status360Server ? "green" : "red"}
                      size={12}
                      containerStyle={{ marginRight: 5 }}
                    />
                    <Text style={styles.statusTextCurrent}>
                      {status360Server ? "Online" : "Offline"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => dispatch(fetchGordon360ServerStatus)}
              style={styles.statusCheckerButton}
            >
              <Text
                style={[styles.statusCheckerButtonText, { color: "#354f86" }]}
              >
                Check Status
              </Text>
            </TouchableOpacity>
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
    borderRadius: 15,
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
});
