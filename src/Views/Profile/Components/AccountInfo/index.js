import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import {
  getUserInfo,
  getUserDining,
  getUserChapel,
  getUserAdvisors,
} from "../../../../store/entities/profile";

export const AccountInfo = () => {
  // User's profile info
  const userInfo = useSelector(getUserInfo);
  // User's dining info
  const userDining = useSelector(getUserDining);
  // User's chapel info
  const userChapel = useSelector(getUserChapel);
  // User's chapel info
  const userAdvisors = useSelector(getUserAdvisors);

  // Info not available text
  const NA = "N/A";

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
   * Returns the JSX of the user's residency if the user is a student
   */
  const getResidence = () => {
    if (userInfo && userInfo.PersonType.trim().includes("stu")) {
      return (
        <View style={styles.accountViewCard}>
          <Image
            style={styles.listItemImage}
            source={require("./Images/residence.png")}
          />
          <Text style={styles.listItemName}>Residence</Text>
          <Text numberOfLines={1} style={styles.listItemValue}>
            {userInfo.OnOffCampus
              ? getResidenceFormat(userInfo.OnOffCampus.trim())
              : NA}
          </Text>
        </View>
      );
    }
  };

  /**
   * Returns the JSX of the user's dormitory if the user is a
   * student and lives on campus
   */
  const getDormitory = () => {
    if (
      userInfo &&
      userInfo.PersonType.trim().includes("stu") &&
      userInfo.OnOffCampus &&
      getResidenceFormat(userInfo.OnOffCampus) === "On Campus"
    )
      return (
        <View style={styles.accountViewCard}>
          <Image
            style={styles.listItemImage}
            source={require("./Images/dormitory.png")}
          />
          <Text style={styles.listItemName}>Dormitory</Text>
          <Text numberOfLines={1} style={styles.listItemValue}>
            {userInfo.BuildingDescription && userInfo.OnCampusRoom
              ? `${userInfo.BuildingDescription.trim()}: Room ${userInfo.OnCampusRoom.trim()}`
              : NA}
          </Text>
        </View>
      );
  };

  /**
   * Returns the JSX of the user's advisor(s) if the user is a student
   */
  const getAdvisors = () => {
    if (userInfo && userInfo.PersonType.trim().includes("stu")) {
      // If there's a list of advisors
      if (userAdvisors) {
        return userAdvisors.map((advisor, index) => {
          return (
            <View key={index} style={styles.accountViewCard}>
              <Image
                style={styles.listItemImage}
                source={require("./Images/advisor.png")}
              />
              {/* 
              Sets the title of the advisor text. If there's more than 
              one advisor, each advisor is given an index number
            */}
              <Text style={styles.listItemName}>{`Advisor ${
                userAdvisors.length > 1 ? `#${index + 1}` : ""
              }`}</Text>
              <Text numberOfLines={1} style={styles.listItemValue}>
                {`${advisor.Firstname.trim()} ${advisor.Lastname.trim()}`}
              </Text>
            </View>
          );
        });
      } else {
        // If there's no list of advisors
        return (
          <View style={styles.accountViewCard}>
            <Image
              style={styles.listItemImage}
              source={require("./Images/advisor.png")}
            />
            <Text style={styles.listItemName}>Advisor</Text>
            <Text numberOfLines={1} style={styles.listItemValue}>
              {NA}
            </Text>
          </View>
        );
      }
    }
  };

  /**
   * Returns the JSX of the user's mailbox
   */
  const getMailbox = () => (
    <View style={styles.accountViewCard}>
      <Image
        style={styles.listItemImage}
        source={require("./Images/mailbox.png")}
      />
      <Text style={styles.listItemName}>Mailbox</Text>
      <Text numberOfLines={1} style={styles.listItemValue}>
        {userInfo && userInfo.Mail_Location
          ? `# ${userInfo.Mail_Location.trim()}`
          : NA}
      </Text>
    </View>
  );

  /**
   * Returns the JSX of the user's ID
   */
  const getID = () => (
    <View style={styles.accountViewCard}>
      <Image style={styles.listItemImage} source={require("./Images/id.png")} />
      <Text style={styles.listItemName}>ID</Text>
      <Text numberOfLines={1} style={styles.listItemValue}>
        {userInfo && userInfo.ID ? userInfo.ID.trim() : NA}
      </Text>
    </View>
  );

  /**
   * Returns the JSX of the user's chapel credits
   */
  const getChapel = () => (
    <View style={styles.accountViewCard}>
      <Image
        style={styles.listItemImage}
        source={require("./Images/chapel.png")}
      />
      <Text style={styles.listItemName}>Chapel Credits</Text>
      <Text numberOfLines={1} style={styles.listItemValue}>
        {/* Defaults chapel credit to (0 earned, 30 remaining) */}
        {userChapel && userChapel.current && userChapel.required
          ? `${userChapel.current}/${userChapel.required}`
          : NA}
      </Text>
    </View>
  );

  /**
   * Returns the JSX of the user's dining swipes
   */
  const getDiningSwipes = () => (
    <View style={styles.accountViewCard}>
      <Image
        style={styles.listItemImage}
        source={require("./Images/diningSwipes.png")}
      />
      <Text style={styles.listItemName}>Dining Swipes</Text>
      <Text numberOfLines={1} style={styles.listItemValue}>
        {userDining && userDining.swipes ? `${userDining.swipes} left` : NA}
      </Text>
    </View>
  );

  /**
   * Returns the JSX of the user's dining dollars
   */
  const getDiningDollars = () => (
    <View style={styles.accountViewCard}>
      <Image
        style={styles.listItemImage}
        source={require("./Images/diningDollars.png")}
      />
      <Text style={styles.listItemName}>Dining Dollars</Text>
      <Text numberOfLines={1} style={styles.listItemValue}>
        {userDining && userDining.dollars ? `$${userDining.dollars}` : NA}
      </Text>
    </View>
  );

  /**
   * Returns the JSX of the user's dining guest swipes
   */
  const getDiningGuestSwipes = () => (
    <View style={styles.accountViewCard}>
      <Image
        style={styles.listItemImage}
        source={require("./Images/diningGuestSwipes.png")}
      />
      <Text style={styles.listItemName}>Dining Guest Swipes</Text>
      <Text numberOfLines={1} style={styles.listItemValue}>
        {userDining && userDining.guestSwipes
          ? `${userDining.guestSwipes} left`
          : NA}
      </Text>
    </View>
  );

  return (
    <View style={styles.accountView}>
      <Text style={styles.accountTitle}>General</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {getID()}
        {getMailbox()}
        {getChapel()}
        {getAdvisors()}
        {getDiningSwipes()}
        {getDiningDollars()}
        {getDiningGuestSwipes()}
        {getResidence()}
        {getDormitory()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemName: {
    fontSize: 18,
    color: "#acdafe",
  },
  listItemValue: {
    color: "white",
    fontSize: 18,
  },
  listItemImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
    tintColor: "white",
  },
  accountView: {
    marginTop: 10,
    marginBottom: 40,
    width: "100%",
  },
  accountViewCard: {
    alignItems: "center",
    backgroundColor: "#014983",
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 10,
    margin: 5,
    minWidth: 100,
  },
  accountTitle: {
    fontSize: 24,
    marginBottom: 5,
    marginLeft: 10,
    color: "#014983",
  },
});
