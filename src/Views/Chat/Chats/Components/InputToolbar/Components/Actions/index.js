import React from "react";
import { Image } from "react-native";
import { Actions } from "react-native-gifted-chat";

/**
 * Renders the Action buttons in the InputToolbar
 * @param {JSON} props Props passed from parent
 */
export const renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Image
        style={{ width: 32, height: 32, tintColor: "#92C7FF" }}
        source={require("../Images/add_button.png")}
      />
    )}
    options={{
      "Choose From Library": () => {
        console.log("Choose From Library");
      },
      Cancel: () => {
        console.log("Cancel");
      },
    }}
    optionTintColor="#222B45"
  />
);
