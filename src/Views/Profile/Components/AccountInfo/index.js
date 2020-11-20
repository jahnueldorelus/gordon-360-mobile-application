import React from "react";
import { View, Text, Image } from "react-native";

export const AccountInfo = (props) => {
  /**
   * Returns the residency of the user if the user is a student
   */
  const getResidence = () => {
    if (
      props.userProfile &&
      props.userProfile.PersonType.trim().includes("stu")
    ) {
      return (
        <View style={props.styles.accountViewCard}>
          <Image
            style={props.styles.listItemImage}
            source={require("./Images/residence.png")}
          />
          <Text style={props.styles.listItemName}>Residence</Text>
          <Text numberOfLines={1} style={props.styles.listItemValue}>
            {getResidenceFormat(props.userProfile.OnOffCampus.trim())}
          </Text>
        </View>
      );
    }
  };

  /**
   * Returns the status of a students's residency
   */
  const getResidenceFormat = (status) => {
    switch (status) {
      case "O":
        status = "Off Campus";
        break;
      case "A":
        status = "Away";
        break;
      case "D":
        status = "";
        break;
      case "P": //Private
        status = "Private as requested.";
        break;
      default:
        status = "On Campus";
    }
    return status;
  };

  /**
   * Returns the dormitory of a user if the user is a student and lives on campus
   */
  const getDormitory = () => {
    if (
      props.userProfile &&
      props.userProfile.PersonType.trim().includes("stu") &&
      getResidenceFormat(props.userProfile.OnOffCampus) === "On Campus"
    )
      return (
        <View style={props.styles.accountViewCard}>
          <Image
            style={props.styles.listItemImage}
            source={require("./Images/dormitory.png")}
          />
          <Text style={props.styles.listItemName}>Dormitory</Text>
          <Text numberOfLines={1} style={props.styles.listItemValue}>
            {props.userProfile.BuildingDescription.trim()}: Room{" "}
            {props.userProfile.OnCampusRoom.trim()}
          </Text>
        </View>
      );
  };

  return (
    <View style={props.styles.accountView}>
      <View style={props.styles.accountViewCard}>
        <Image
          style={props.styles.listItemImage}
          source={require("./Images/id.png")}
        />
        <Text style={props.styles.listItemName}>ID</Text>
        <Text numberOfLines={1} style={props.styles.listItemValue}>
          {props.userProfile.ID.trim()}
        </Text>
      </View>
      {/********************** Mailbox # **********************/}
      <View style={props.styles.accountViewCard}>
        <Image
          style={props.styles.listItemImage}
          source={require("./Images/mailbox.png")}
        />
        <Text style={props.styles.listItemName}>Mailbox</Text>
        <Text numberOfLines={1} style={props.styles.listItemValue}>
          # {props.userProfile.Mail_Location.trim()}
        </Text>
      </View>
      {/********************** Chapel Credits Info **********************/}
      <View style={props.styles.accountViewCard}>
        <Image
          style={props.styles.listItemImage}
          source={require("./Images/chapel.png")}
        />
        <Text style={props.styles.listItemName}>Chapel Credits</Text>
        <Text numberOfLines={1} style={props.styles.listItemValue}>
          {props.userChapel.current}/{props.userChapel.required}
        </Text>
      </View>
      {/********************** Dining Info **********************/}
      <View style={props.styles.accountViewCard}>
        <Image
          style={props.styles.listItemImage}
          source={require("./Images/diningSwipes.png")}
        />
        <Text style={props.styles.listItemName}>Dining Swipes</Text>
        <Text numberOfLines={1} style={props.styles.listItemValue}>
          {props.userDining.swipes} left
        </Text>
      </View>
      <View style={props.styles.accountViewCard}>
        <Image
          style={props.styles.listItemImage}
          source={require("./Images/diningDollars.png")}
        />
        <Text style={props.styles.listItemName}>Dining Dollars</Text>
        <Text numberOfLines={1} style={props.styles.listItemValue}>
          ${props.userDining.dollars}
        </Text>
      </View>
      <View style={props.styles.accountViewCard}>
        <Image
          style={props.styles.listItemImage}
          source={require("./Images/diningGuestSwipes.png")}
        />
        <Text style={props.styles.listItemName}>Dining Guest Swipes</Text>
        <Text numberOfLines={1} style={props.styles.listItemValue}>
          {props.userDining.guestSwipes} left
        </Text>
      </View>
      {/********************** Residence Info (For Students Only) **********************/}
      {getResidence()}
      {/********************** Dormitory Info **********************/}
      {getDormitory()}
    </View>
  );
};
