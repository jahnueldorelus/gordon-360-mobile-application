import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { fetchGordon360ServerStatus } from "../../../store/entities/Settings/settings";
import {
  get360ServerLastCheckedDate,
  get360ServerStatus,
} from "../../../store/entities/Settings/settingsSelectors";
import { useDispatch, useSelector } from "react-redux";

export const StatusServer = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // Gordon 360 Server status
  const status360Server = useSelector(get360ServerStatus);
  // Gordon 360 Server last checked date
  const lastChecked360Server = useSelector(get360ServerLastCheckedDate);

  useEffect(() => {
    // Fetches the status of Gordon's 360's website and server
    dispatch(fetchGordon360ServerStatus);
  }, []);

  return (
    <View
      style={[
        props.styles.statusContainer,
        {
          backgroundColor: "#014983",
        },
      ]}
    >
      <View style={props.styles.statusTextAndIconContainer}>
        <View style={props.styles.statusIconContainer}>
          <Icon
            name="server"
            type="font-awesome-5"
            color="#354f86"
            size={40}
            containerStyle={props.styles.statusIcon}
          />
        </View>
        <View style={props.styles.statusTextContainer}>
          <Text style={props.styles.statusTextTitle}>Gordon 360 Server</Text>
          <Text
            style={[
              props.styles.statusTextDate,
              props.styles.statusTextDateBold,
            ]}
          >
            {"Last Checked: "}
            <Text style={props.styles.statusTextDate}>
              {lastChecked360Server ? lastChecked360Server : "No Previous Date"}
            </Text>
          </Text>
          {lastChecked360Server && (
            <View style={props.styles.statusTextCurrentContainer}>
              <Icon
                name="circle"
                solid={true}
                type="font-awesome-5"
                color={status360Server ? "green" : "red"}
                size={12}
                containerStyle={{ marginRight: 5 }}
              />
              <Text style={props.styles.statusTextCurrent}>
                {status360Server ? "Online" : "Offline"}
              </Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => dispatch(fetchGordon360ServerStatus)}
        style={props.styles.statusCheckerButton}
      >
        <Text
          style={[props.styles.statusCheckerButtonText, { color: "#354f86" }]}
        >
          Check Status
        </Text>
      </TouchableOpacity>
    </View>
  );
};
