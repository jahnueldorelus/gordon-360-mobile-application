import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { StyleSheet } from "react-native";
import { getRoomImage, getChatName } from "../../../../Services/Messages";
import { Icon } from "react-native-elements";
import { ChatInfo } from "../../../../Views/Chat/ChatInfo/index";
import { getUserRoomByID } from "../../../../store/entities/chat";
import { getSelectedRoomID } from "../../../../store/ui/chat";
import { getUserInfo } from "../../../../store/entities/profile";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export const AppbarChat = (props) => {
  // User's selected room
  const roomID = useSelector(getSelectedRoomID);
  // User's selected room
  const userRoom = useSelector(getUserRoomByID(roomID));
  // User's profile
  const userProfile = useSelector(getUserInfo);
  // Modal's visibility
  const [modalInfoVisible, setModaInfoVisible] = useState(false);
  // React Native Navigation
  const navigation = useNavigation();

  if (userRoom && userProfile)
    return (
      <View style={styles.appBarContainer}>
        <View style={styles.navigationButton}>
          <Icon
            name="arrow-circle-left"
            type="font-awesome-5"
            color="white"
            size={30}
            onPress={() => {
              navigation.pop();
              navigation.navigate("Rooms");
            }}
          />
        </View>
        <View style={styles.chatName}>
          <Image
            style={styles.image}
            source={getRoomImage(userRoom, userProfile.ID)}
          />
          <Text style={styles.text} numberOfLines={1}>
            {getChatName(userRoom, userProfile.ID)}
          </Text>
        </View>
        <View style={styles.options}>
          <Icon
            name="info"
            type="material"
            color="white"
            size={30}
            onPress={() => {
              setModaInfoVisible(true);
            }}
          />
        </View>
        <ChatInfo
          {...props}
          visible={modalInfoVisible}
          setVisible={setModaInfoVisible}
        />
      </View>
    );
  else return <></>;
};

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  navigationButton: { marginHorizontal: 10 },
  navigationButtonImage: {
    width: 32,
    height: 32,
    tintColor: "white",
  },
  chatName: {
    flex: 1,
    alignItems: "center",
  },
  avatar: { paddingLeft: 10 },
  text: {
    paddingTop: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  options: {
    marginHorizontal: 10,
  },
  image: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "white",
    height: 36,
    width: 36,
    borderRadius: 50,
  },
});
