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
      backgroundColor: "white",
    },
    infoContainer: { paddingHorizontal: 20, paddingTop: 20 },
    introText: { fontSize: 21, alignSelf: "center", marginBottom: 15 },
    introTextName: { color: "#014983" },
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
      borderWidth: 1,
      marginBottom: 10,
      alignSelf: "center",
    },
    infoView: {
      flexDirection: "row",
      marginBottom: 20,
      marginHorizontal: 10,
      width: "100%",
    },
    infoViewCard: {
      alignItems: "center",
      backgroundColor: "#014983",
      borderRadius: 10,
      marginHorizontal: 10,
      padding: 10,
      margin: 5,
      minWidth: 100,
    },
    schedule: {
      paddingBottom: 20,
    },
  });

  if (userProfile && userImage && userDining)
    return (
      <View style={styles.mainContaner}>
        <ScrollView>
          <View style={styles.infoContainer}>
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
            <ScrollView horizontal>
              <View style={styles.infoView}>
                <View style={styles.infoViewCard}>
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
                <View style={styles.infoViewCard}>
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
                <View style={styles.infoViewCard}>
                  <Image
                    style={styles.listItemImage}
                    source={require("./Images/dining.png")}
                  />
                  <Text style={styles.listItemName}>Dining</Text>
                  <Text numberOfLines={1} style={styles.listItemValue}>
                    0
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
          {/********************** Scheduling Info **********************/}
          {userSchedule && (
            <View style={styles.schedule}>
              <OfflineSchedule events={userSchedule} />
            </View>
          )}
        </ScrollView>
      </View>
    );
  else return <></>;
};
