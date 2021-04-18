import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ProfileInfo } from "./Components/ProfileInfo";
import { AccountInfo } from "./Components/AccountInfo";
import { Involvements } from "./Components/Involvements";
import { Schedule } from "./Components/CourseSchedule";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdvisors,
  fetchChapel,
  fetchDining,
  fetchImage,
  fetchInvolvements,
  fetchProfile,
  fetchSchedule,
  getUserInfo,
} from "../../store/entities/profile";

export const Profile = () => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // User's profile info
  const userInfo = useSelector(getUserInfo);

  // Gets the user's profile info
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchImage());
    dispatch(fetchDining());
    dispatch(fetchSchedule());
    dispatch(fetchChapel());
  }, []);

  // Gets the user's involvements and advisor(s) after their profile info is retrieved
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchInvolvements(userInfo.ID));
      dispatch(fetchAdvisors(userInfo.AD_Username));
    }
  }, [userInfo]);

  return (
    <View style={styles.mainContaner}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainerTop}>
          <ProfileInfo />
        </View>

        <View>
          <AccountInfo />
        </View>

        <View style={styles.infoContainerMiddle}>
          <Schedule />
        </View>

        <View style={styles.infoContainerBottom}>
          <Involvements />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContaner: {
    flex: 1,
    backgroundColor: "white",
  },
  infoContainerTop: { paddingTop: 20 },
  infoContainerMiddle: { paddingHorizontal: 10, marginBottom: 20 },
  infoContainerBottom: {
    paddingTop: 20,
    marginHorizontal: 10,
    paddingBottom: 20,
  },
});
