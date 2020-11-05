import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  getUserProfile,
  getUserImage,
  getUserDining,
} from "../../Services/Offline360/Offline360Service";
import { OfflineSchedule } from "./Components/OfflineSchedule";

export const Offline360 = (props) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userDining, setUserDining] = useState(null);

  // Gets the user's profile
  useEffect(() => {
    async function getProfile() {
      setUserProfile(await getUserProfile());
    }
    getProfile();
  }, []);

  // Gets the user's image
  useEffect(() => {
    async function getImage() {
      setUserImage(await getUserImage());
    }
    getImage();
  }, []);

  // Gets the user's dining info
  useEffect(() => {
    async function getDining() {
      setUserDining(await getUserDining());
    }
    getDining();
  }, []);

  const styles = StyleSheet.create({
    mainContaner: {
      flex: 1,
      backgroundColor: "white",
    },
    infoContainer: { paddingTop: 20 },
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
    userImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    profileView: {
      marginTop: 5,
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
      marginHorizontal: 10,
      borderRadius: 10,
      borderColor: "#014983",
      borderWidth: 1,
    },
    profileViewImage: {
      backgroundColor: "#014983",
      padding: 6,
    },
    profileViewText: {
      marginHorizontal: 10,
      backgroundColor: "white",
      flex: 1,
    },
    profileViewTextStyle: { fontSize: 21 },
    profileViewTextClass: { color: "rgba(0,0,0,0.4)" },
    profileViewTextName: { color: "black" },
    profileViewTextEmail: { color: "#014983" },
    accountView: {
      flexDirection: "row",
      marginBottom: 20,
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
    schedule: {
      marginHorizontal: 10,
      marginBottom: 20,
    },
  });

  /**
   * Returns the class of a student
   */
  const getUserClass = (studentClass) => {
    switch (studentClass) {
      case "1":
        studentClass = "Freshman";
        break;
      case "2":
        studentClass = "Sophomore";
        break;
      case "3":
        studentClass = "Junior";
        break;
      case "4":
        studentClass = "Senior";
        break;
      case "5":
        studentClass = "Graduate Student";
        break;
      case "6":
        studentClass = "Undergraduate Conferred";
        break;
      case "7":
        studentClass = "Graduate Conferred";
        break;
      default:
        studentClass = "Student";
    }

    return studentClass;
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
   * Returns the residency of the user if the user is a student
   */
  const getResidence = () => {
    if (userProfile.PersonType.includes("stu")) {
      return (
        <View style={styles.accountViewCard}>
          <Image
            style={styles.listItemImage}
            source={require("./Images/residence.png")}
          />
          <Text style={styles.listItemName}>Residence</Text>
          <Text numberOfLines={1} style={styles.listItemValue}>
            {getResidenceFormat(userProfile.OnOffCampus)}
          </Text>
        </View>
      );
    }
  };

  /**
   * Returns the dormitory of a user if the user is a student and lives on campus
   */
  const getDormitory = () => {
    if (
      userProfile.PersonType.includes("stu") &&
      getResidenceFormat(userProfile.OnOffCampus) === "On Campus"
    )
      return (
        <View style={styles.accountViewCard}>
          <Image
            style={styles.listItemImage}
            source={require("./Images/dormitory.png")}
          />
          <Text style={styles.listItemName}>Dormitory</Text>
          <Text numberOfLines={1} style={styles.listItemValue}>
            {userProfile.BuildingDescription}: Room {userProfile.OnCampusRoom}
          </Text>
        </View>
      );
  };

  if (userProfile && userImage && userDining)
    return (
      <View style={styles.mainContaner}>
        <ScrollView>
          <View style={styles.infoContainer}>
            <View style={styles.profileView}>
              <View style={styles.profileViewImage}>
                {/********************** User Image **********************/}
                <Image
                  source={{ uri: `data:image/gif;base64,${userImage}` }}
                  style={styles.userImage}
                />
              </View>
              {/********************** Intro Text **********************/}
              <View style={styles.profileViewText}>
                <Text
                  style={[
                    styles.profileViewTextStyle,
                    styles.profileViewTextClass,
                  ]}
                >
                  {getUserClass(userProfile.Class)}
                </Text>
                <Text
                  style={[
                    styles.profileViewTextStyle,
                    styles.profileViewTextName,
                  ]}
                >
                  {userProfile.FirstName} {userProfile.LastName}{" "}
                  {userProfile.NickName !== userProfile.FirstName
                    ? userProfile.NickName
                    : ""}
                </Text>
                <Text
                  style={[
                    styles.profileViewTextStyle,
                    styles.profileViewTextEmail,
                  ]}
                >
                  {userProfile.Email}
                </Text>
              </View>
            </View>
            {/********************** User ID **********************/}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.accountView}>
                <View style={styles.accountViewCard}>
                  <Image
                    style={styles.listItemImage}
                    source={require("./Images/id.png")}
                  />
                  <Text style={styles.listItemName}>ID</Text>
                  <Text numberOfLines={1} style={styles.listItemValue}>
                    {userProfile.ID}
                  </Text>
                </View>
                {/********************** Mailbox # **********************/}
                <View style={styles.accountViewCard}>
                  <Image
                    style={styles.listItemImage}
                    source={require("./Images/mailbox.png")}
                  />
                  <Text style={styles.listItemName}>Mailbox</Text>
                  <Text numberOfLines={1} style={styles.listItemValue}>
                    #{userProfile.Mail_Location}
                  </Text>
                </View>
                {/********************** Dining Info **********************/}
                <View style={styles.accountViewCard}>
                  <Image
                    style={styles.listItemImage}
                    source={require("./Images/dining.png")}
                  />
                  <Text style={styles.listItemName}>Dining</Text>
                  <Text numberOfLines={1} style={styles.listItemValue}>
                    0
                  </Text>
                </View>
                {/********************** Residence Info (For Students Only) **********************/}
                {getResidence()}
                {/********************** Dormitory Info **********************/}
                {getDormitory()}
              </View>
            </ScrollView>
          </View>
          {/********************** Scheduling Info **********************/}
          <View style={styles.schedule}>
            <OfflineSchedule />
          </View>
        </ScrollView>
      </View>
    );
  else return <></>;
};
