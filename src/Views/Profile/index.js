import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ProfileInfo } from "./Components/ProfileInfo";
import { AccountInfo } from "./Components/AccountInfo";
import { Involvements } from "./Components/Involvements";
import {
  getUserProfile,
  getUserImage,
  getUserDining,
  getUserInvolvements,
  getUserChapelInfo,
} from "../../Services/Profile/ProfileService";
import { Schedule } from "./Components/CourseSchedule";

export const Profile = () => {
  const [userProfileInfo, setUserProfileInfo] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userDining, setUserDining] = useState(null);
  const [userChapel, setUserChapel] = useState(null);
  const [userInvolvements, setUserInvolvements] = useState(null);

  // Gets the user's profile, image, and dining info
  useEffect(() => {
    getProfile();
    getImage();
    getDining();
  }, []);

  // Gets the user's involvements and chapel info when their profile,
  // is available
  useEffect(() => {
    getInvolvements();
    getChapel();
  }, [userProfileInfo]);

  // Gets the user's profile
  async function getProfile() {
    setUserProfileInfo(await getUserProfile());
  }

  // Gets the user's image
  async function getImage() {
    setUserImage(await getUserImage());
  }

  // Gets the user's dining info
  async function getDining() {
    let data = await getUserDining();
    let diningData = {};
    // If there's data, then the user has a dining plan. Otherwise, they have no plan
    if (data && data.Swipes && data.DiningDollars && data.GuestSwipes) {
      // Creates the user's dining data. If the current balance is null, then the user has no balance
      diningData.swipes = data.Swipes.CurrentBalance
        ? data.Swipes.CurrentBalance
        : 0;
      diningData.dollars = data.DiningDollars.CurrentBalance
        ? data.DiningDollars.CurrentBalance
        : 0;
      diningData.guestSwipes = data.GuestSwipes.CurrentBalance
        ? data.GuestSwipes.CurrentBalance
        : 0;
    } else {
      // Creates the user's dining data with each balance set to 0 since there's no dining plan
      diningData.swipes = 0;
      diningData.dollars = 0;
      diningData.guestSwipes = 0;
    }
    setUserDining(diningData);
  }

  // Gets the user's involvements info
  async function getInvolvements() {
    // Gets the user's involvements only if the user's ID is available
    if (userProfileInfo && userProfileInfo.ID)
      setUserInvolvements(await getUserInvolvements(userProfileInfo.ID));
  }
  // Gets the user's chapel info
  async function getChapel() {
    setUserChapel(await getUserChapelInfo());
  }
  if (
    userProfileInfo &&
    userImage &&
    userDining &&
    userInvolvements &&
    userChapel
  )
    return (
      <View style={styles.mainContaner}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.infoContainer}>
            <ProfileInfo
              userProfile={userProfileInfo}
              userImage={userImage}
              styles={styles}
            />
            {/********************** User ID **********************/}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <AccountInfo
                userProfile={userProfileInfo}
                userChapel={userChapel}
                userDining={userDining}
                styles={styles}
              />
            </ScrollView>
          </View>
          {/********************** Scheduling Info **********************/}
          <View style={styles.schedule}>
            <Schedule />
          </View>
          <View style={styles.involvements}>
            <Involvements userInvolvements={userInvolvements} styles={styles} />
          </View>
        </ScrollView>
      </View>
    );
  else return <></>;
};

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
  involvements: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  involvementsCard: {
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    backgroundColor: "#014983",
  },
  profileViewImage: {
    padding: 6,
    justifyContent: "center",
  },
  profileViewTextContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  profileViewText: {
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
  },
  profileViewTextStyle: { fontSize: 21 },
  profileViewTextClass: { color: "rgba(0,0,0,0.55)" },
  profileViewTextName: { color: "black" },
  profileViewTextEmail: { color: "#014983" },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
});
