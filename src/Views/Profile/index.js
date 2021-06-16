import React, { useEffect, useState } from "react";
import { View, StyleSheet, RefreshControl, ScrollView } from "react-native";
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
  getReqUserAdvisorsStatus,
  getReqUserChapelStatus,
  getReqUserDiningStatus,
  getReqUserImageStatus,
  getReqUserInvolvementsStatus,
  getReqUserProfileStatus,
  getReqUserScheduleStatus,
} from "../../store/entities/profile";
import { getDeviceOrientation } from "../../store/ui/app";

export const Profile = () => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // User's profile info
  const userInfo = useSelector(getUserInfo);

  /**
   * REQUESTS' PENDING STATUS
   */
  // User's advisors request pending status
  const isReqAdvisorsPending = useSelector(getReqUserAdvisorsStatus);
  // User's chapel request pending status
  const isReqChapelPending = useSelector(getReqUserChapelStatus);
  // User's dining request pending status
  const isReqDiningPending = useSelector(getReqUserDiningStatus);
  // User's image request pending status
  const isReqImagePending = useSelector(getReqUserImageStatus);
  // User's involvements request pending status
  const isReqInvolvementsPending = useSelector(getReqUserInvolvementsStatus);
  // User's profile request pending status
  const isReqProfilePending = useSelector(getReqUserProfileStatus);
  // User's schedule request pending status
  const isReqSchedulePending = useSelector(getReqUserScheduleStatus);
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);
  // Determines if the user's data is still in the middle of being requested
  const [dataLoading, setDataLoading] = useState(false);

  // Gets the user's profile info
  useEffect(() => {
    getAllUserInfo();
  }, []);

  /**
   * Fetches all of the user's information for this component
   */
  const getAllUserInfo = () => {
    dispatch(fetchProfile);
    dispatch(fetchImage);
    dispatch(fetchDining);
    dispatch(fetchSchedule);
    dispatch(fetchChapel);
  };

  /**
   * Determines if the scrollview should show the loading indicator to alert
   * the user that data is being fetched
   */
  useEffect(() => {
    // Determines if user the user's data is being requested
    const isUserDataPending =
      isReqAdvisorsPending ||
      isReqChapelPending ||
      isReqDiningPending ||
      isReqImagePending ||
      isReqInvolvementsPending ||
      isReqProfilePending ||
      isReqSchedulePending;
    isUserDataPending ? setDataLoading(true) : setDataLoading(false);
  }, [
    isReqAdvisorsPending,
    isReqChapelPending,
    isReqDiningPending,
    isReqImagePending,
    isReqInvolvementsPending,
    isReqProfilePending,
    isReqSchedulePending,
  ]);

  // Gets the user's involvements and advisor(s) after their profile info is retrieved
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchInvolvements);
      dispatch(fetchAdvisors);
    }
  }, [userInfo]);

  return (
    <ScrollView
      /**
       * Scroll indicator prevents glitch with scrollbar appearing
       * in the middle of the screen
       */
      scrollIndicatorInsets={{ right: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={dataLoading}
          onRefresh={() => {
            getAllUserInfo();
          }}
        />
      }
      style={styles.mainContaner}
    >
      <View
        style={[
          styles.mainContaner,
          {
            paddingHorizontal: screenOrientation === "landscape" ? "10%" : 0,
          },
        ]}
      >
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
      </View>
    </ScrollView>
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
