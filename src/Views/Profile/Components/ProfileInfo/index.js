import React from "react";
import { View, Text, Image } from "react-native";

export const ProfileInfo = (props) => {
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

  return (
    <View style={props.styles.profileView}>
      <View style={props.styles.profileViewImage}>
        {/********************** User Image **********************/}
        <Image
          source={{ uri: `data:image/gif;base64,${props.userImage}` }}
          style={props.styles.userImage}
        />
      </View>
      {/********************** Intro Text **********************/}
      <View style={props.styles.profileViewTextContainer}>
        <View style={props.styles.profileViewText}>
          <Text
            style={[
              props.styles.profileViewTextStyle,
              props.styles.profileViewTextClass,
            ]}
          >
            {getUserClass(props.userProfile.Class)}
          </Text>
          <Text
            style={[
              props.styles.profileViewTextStyle,
              props.styles.profileViewTextName,
            ]}
          >
            {props.userProfile.FirstName.trim()}{" "}
            {props.userProfile.LastName.trim()}
            {props.userProfile.NickName.trim() !==
            props.userProfile.FirstName.trim()
              ? ` (${props.userProfile.NickName.trim()})`
              : ""}
          </Text>
          <Text
            style={[
              props.styles.profileViewTextStyle,
              props.styles.profileViewTextEmail,
            ]}
          >
            {props.userProfile.Email.trim()}
          </Text>
        </View>
      </View>
    </View>
  );
};
