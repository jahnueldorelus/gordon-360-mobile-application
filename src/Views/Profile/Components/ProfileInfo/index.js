import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { getUserInfo, getUserImage } from "../../../../store/entities/profile";

export const ProfileInfo = () => {
  // User's profile info
  const userInfo = useSelector(getUserInfo);
  // User's image
  const userImage = useSelector(getUserImage);

  /**
   * Returns the class of a student
   */
  const getUserClass = () => {
    let userClass = userInfo.Class;
    switch (userClass) {
      case "1":
        userClass = "Freshman";
        break;
      case "2":
        userClass = "Sophomore";
        break;
      case "3":
        userClass = "Junior";
        break;
      case "4":
        userClass = "Senior";
        break;
      case "5":
        userClass = "Graduate Student";
        break;
      case "6":
        userClass = "Undergraduate Conferred";
        break;
      case "7":
        userClass = "Graduate Conferred";
        break;
      default:
        userClass = "Student";
    }

    return userClass;
  };

  /**
   * Returns the user's full name
   */
  const getUserFullName = () =>
    `${userInfo.FirstName.trim()} ${userInfo.LastName.trim()}`;

  /**
   * Returns the user's nickname if available
   */
  const getUserNickname = () =>
    userInfo.NickName.trim() !== userInfo.FirstName.trim()
      ? ` (${userInfo.NickName.trim()})`
      : "";

  /**
   * Returns the user's email
   */
  const getUserEmail = () => userInfo.Email.trim();

  return (
    <View style={styles.profileView}>
      <View style={styles.profileViewImageContainer}>
        {/********************** User Image **********************/}
        <Image
          source={
            userImage
              ? { uri: `data:image/gif;base64,${userImage}` }
              : require("./Images/user.png")
          }
          style={
            userImage ? styles.profileViewImage : styles.profileViewImageDefault
          }
        />
      </View>
      {/********************** User Info **********************/}
      <View style={styles.profileViewTextContainer}>
        <View style={styles.profileViewText}>
          <Text
            style={[styles.profileViewTextStyle, styles.profileViewTextClass]}
          >
            {userInfo ? getUserClass() : "Class: N/A"}
          </Text>
          <Text
            style={[styles.profileViewTextStyle, styles.profileViewTextName]}
          >
            {userInfo
              ? `${getUserFullName()} ${getUserNickname()}`
              : "Name: N/A"}
          </Text>
          <Text
            style={[styles.profileViewTextStyle, styles.profileViewTextEmail]}
          >
            {userInfo ? getUserEmail() : "Email: N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  profileViewImageContainer: {
    padding: 8,
    justifyContent: "center",
  },
  profileViewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  profileViewImageDefault: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    tintColor: "#014983",
    backgroundColor: "white",
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
});
