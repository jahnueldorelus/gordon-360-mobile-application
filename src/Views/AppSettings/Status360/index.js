import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import { fetchGordon360SiteStatus } from "../../../store/entities/Settings/settings";
import { useDispatch, useSelector } from "react-redux";
import {
  get360SiteLastCheckedDate,
  get360SiteStatus,
  get360SitePending,
} from "../../../store/entities/Settings/settingsSelectors";

export const Status360 = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // Gordon 360 Website status
  const status360Site = useSelector(get360SiteStatus);
  // Gordon 360 Website request pending status
  const is360SitePending = useSelector(get360SitePending);
  // Gordon 360 Website last checked date
  const lastChecked360Site = useSelector(get360SiteLastCheckedDate);

  useEffect(() => {
    // Fetches the status of Gordon's 360's website and server
    dispatch(fetchGordon360SiteStatus);
  }, []);

  return (
    <View
      style={[
        props.styles.itemContainer,
        {
          backgroundColor: "#015483",
        },
      ]}
    >
      <View style={props.styles.itemTextAndIconContainer}>
        <View style={props.styles.itemIconContainer}>
          <Icon
            name="web"
            type="material-5"
            color="#224d85"
            size={40}
            containerStyle={props.styles.itemIcon}
          />
        </View>
        <View style={props.styles.itemTextContainer}>
          <Text style={props.styles.itemTextTitle}>Gordon 360 Site</Text>
          <Text
            style={[props.styles.itemTextDate, props.styles.itemTextDateBold]}
          >
            {"Last Checked: "}
            <Text style={props.styles.itemTextDate}>
              {lastChecked360Site ? lastChecked360Site : "No Previous Date"}
            </Text>
          </Text>
          {lastChecked360Site && (
            <View style={props.styles.itemTextCurrentContainer}>
              <Icon
                name="circle"
                solid={true}
                type="font-awesome-5"
                color={
                  is360SitePending ? "gray" : status360Site ? "green" : "red"
                }
                size={12}
                containerStyle={{ marginRight: 5 }}
              />
              <Text style={props.styles.itemTextCurrent}>
                {is360SitePending
                  ? "Checking..."
                  : status360Site
                  ? "Online"
                  : "Offline"}
              </Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => dispatch(fetchGordon360SiteStatus)}
        style={props.styles.itemButton}
      >
        <Text style={[props.styles.itemButtonText, { color: "#224d85" }]}>
          Check Status
        </Text>
      </TouchableOpacity>
    </View>
  );
};
