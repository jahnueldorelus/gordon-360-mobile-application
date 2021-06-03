import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { getUserInfo, getUserImage } from "../../../../store/entities/profile";
import { AppImageViewer } from "../../../../Components/AppImageViewer";

export const ProfileInfo = () => {
  // User's profile info
  const userInfo = useSelector(getUserInfo);
  // User's image
  const userImage = useSelector(getUserImage);
  // Image to show in the image viewer
  const [imageToView, setImageToView] = useState(null);
  // Determines if the image viewer should display
  const [showImageViewer, setShowImageViewer] = useState(false);

  /**
   * If an image is set to be shown, the image viewer will open. Otherwise,
   * the image viewer will be closed (if opened) and the image to be shown
   * will be reset
   */
  useEffect(() => {
    if (imageToView && showImageViewer) {
      setShowImageViewer(true);
    } else {
      setShowImageViewer(false);
      setImageToView(null);
    }
  }, [imageToView, showImageViewer]);

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
        <TouchableOpacity
          activeOpacity={0.75}
          underlayColor="none"
          onPress={() => {
            setImageToView(userImage);
            setShowImageViewer(true);
          }}
        >
          <Image
            source={
              userImage
                ? { uri: `data:image/gif;base64,${userImage}` }
                : require("./Images/user.png")
            }
            style={
              userImage
                ? styles.profileViewImage
                : styles.profileViewImageDefault
            }
          />
        </TouchableOpacity>
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

      {/* Image Viewer */}
      <AppImageViewer
        image={imageToView}
        visible={showImageViewer}
        setVisible={setShowImageViewer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileView: {
    marginTop: 5,
    marginBottom: 20,
    alignItems: "center",
    overflow: "hidden",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  profileViewImageContainer: {
    padding: 8,
    justifyContent: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
  },
  profileViewImage: {
    width: Dimensions.get("screen").width / 2,
    height: Dimensions.get("screen").width / 2,
    maxWidth: 300,
    maxHeight: 300,
    alignSelf: "center",
    borderRadius: 150,
    borderWidth: 0.1,
    borderColor: "black",
  },
  profileViewImageDefault: {
    width: Dimensions.get("screen").width / 2,
    height: Dimensions.get("screen").width / 2,
    maxWidth: 300,
    maxHeight: 300,
    alignSelf: "center",
    borderRadius: 100,
    tintColor: "#014983",
    backgroundColor: "white",
  },
  profileViewTextContainer: {
    marginTop: 10,
    backgroundColor: "white",
    flex: 1,
  },
  profileViewText: {
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
  },
  profileViewTextStyle: { fontSize: 21 },
  profileViewTextClass: { color: "rgba(0,0,0,0.55)", textAlign: "center" },
  profileViewTextName: { color: "black", textAlign: "center" },
  profileViewTextEmail: { color: "#014983", textAlign: "center" },
});
