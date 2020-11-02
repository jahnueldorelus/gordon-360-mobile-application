import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  getUserProfile,
  getUserImage,
  getUserDining,
  getUserSchedule,
} from "../../Services/Offline360/Offline360Service";
import { OfflineSchedule } from "./Components/OfflineSchedule";

export const Offline360 = (props) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userDining, setUserDining] = useState(null);
  const [userSchedule, setUserSchedule] = useState(null);

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

  // Gets the user's schedule info
  useEffect(() => {
    async function getSchedule() {
      setUserSchedule(await getUserSchedule());
    }
    getSchedule();
  }, []);

  const styles = StyleSheet.create({
    mainContaner: {
      flex: 1,
      //   padding: 20,
      backgroundColor: "white",
    },
    infoView: { padding: 20 },
    introText: { fontSize: 21, alignSelf: "center", marginBottom: 15 },
    introTextName: { color: "#014983" },
    listItemName: {
      fontSize: 18,
    },
    listItemValue: {
      color: "#014983",
      fontSize: 18,
    },
    userImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      marginBottom: 10,
      alignSelf: "center",
    },
  });

  if (userProfile && userImage && userDining)
    return (
      <View style={styles.mainContaner}>
        <ScrollView>
          <View style={styles.infoView}>
            {/********************** User Image **********************/}
            <Image
              source={{ uri: `data:image/gif;base64,${userImage}` }}
              style={styles.userImage}
            />
            {/********************** Intro Text **********************/}
            <Text style={styles.introText}>
              Hello,{" "}
              <Text style={styles.introTextName}>
                {userProfile.FirstName} {userProfile.LastName}
              </Text>
            </Text>
            {/********************** User ID **********************/}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.listItemName}>ID #</Text>
              <Text style={styles.listItemValue}>{userProfile.ID}</Text>
            </View>

            {/********************** Mailbox # **********************/}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.listItemName}>Mailbox #</Text>
              <Text style={styles.listItemValue}>
                {userProfile.Mail_Location}
              </Text>
            </View>

            {/********************** Dining Info **********************/}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.listItemName}>Dining</Text>
              <Text style={styles.listItemValue}>0</Text>
            </View>
          </View>
          {/********************** Scheduling Info **********************/}
          {userSchedule && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <OfflineSchedule events={userSchedule} />
            </View>
          )}
        </ScrollView>
      </View>
    );
  else return <></>;
};
