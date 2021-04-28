import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { fetchGordon360ServerStatus } from "../../../store/entities/Settings/settings";
import {
  get360ServerLastCheckedDate,
  get360ServerStatus,
  get360ServerPending,
} from "../../../store/entities/Settings/settingsSelectors";
import { useDispatch, useSelector } from "react-redux";

export const StatusServer = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // Gordon 360 Server status
  const status360Server = useSelector(get360ServerStatus);
  // Gordon 360 Server request pending status
  const is360ServerPending = useSelector(get360ServerPending);
  // Gordon 360 Server last checked date
  const lastChecked360Server = useSelector(get360ServerLastCheckedDate);

  useEffect(() => {
    // Fetches the status of Gordon's 360's website and server
    dispatch(fetchGordon360ServerStatus);
  }, []);

  return (
    <View
      style={[
        props.styles.itemContainer,
        {
          backgroundColor: "#014983",
        },
      ]}
    >
      <View style={props.styles.itemTextAndIconContainer}>
        <View style={props.styles.itemIconContainer}>
          <Icon
            name="server"
            type="font-awesome-5"
            color="#354f86"
            size={40}
            containerStyle={props.styles.itemIcon}
          />
        </View>
        <View style={props.styles.itemTextContainer}>
          <Text style={props.styles.itemTextTitle}>Gordon 360 Server</Text>
          <Text
            style={[props.styles.itemTextDate, props.styles.itemTextDateBold]}
          >
            {"Last Checked: "}
            <Text style={props.styles.itemTextDate}>
              {lastChecked360Server ? lastChecked360Server : "No Previous Date"}
            </Text>
          </Text>
          {lastChecked360Server && (
            <View style={props.styles.itemTextCurrentContainer}>
              <Icon
                name="circle"
                solid={true}
                type="font-awesome-5"
                color={
                  is360ServerPending
                    ? "gray"
                    : status360Server
                    ? "green"
                    : "red"
                }
                size={12}
                containerStyle={{ marginRight: 5 }}
              />
              <Text style={props.styles.itemTextCurrent}>
                {is360ServerPending
                  ? "Checking..."
                  : status360Server
                  ? "Online"
                  : "Offline"}
              </Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => dispatch(fetchGordon360ServerStatus)}
        style={props.styles.itemButton}
      >
        <Text style={[props.styles.itemButtonText, { color: "#354f86" }]}>
          Check Status
        </Text>
      </TouchableOpacity>
    </View>
  );
};
