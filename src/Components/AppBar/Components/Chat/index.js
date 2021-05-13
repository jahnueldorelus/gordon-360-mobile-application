import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image } from "react-native";
import { StyleSheet } from "react-native";
import {
  getRoomImage,
  getChatName,
  removeNotificationsInTray,
} from "../../../../Services/Messages";
import { Icon } from "react-native-elements";
import { ChatInfo } from "../../../../Views/Chat/ChatInfo/index";
import { getUserRoomByID } from "../../../../store/entities/chat";
import {
  getSelectedRoomID,
  setChatOpenedAndVisible,
  getChatOpenedAndVisible,
  getImageContent,
} from "../../../../store/ui/chat";
import { getUserInfo } from "../../../../store/entities/profile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { ScreenNames } from "../../../../../ScreenNames";

export const AppbarChat = () => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // User's selected room ID
  const userSelectedRoomID = useSelector(getSelectedRoomID);
  // Reference to the user's selected room
  const userSelectedRoomIDRef = useRef(userSelectedRoomID);
  // Determines if a chat is opened and visible
  const ischatOpenedAndVisible = useSelector(getChatOpenedAndVisible);
  // User's selected room
  const userRoom = useSelector(getUserRoomByID(userSelectedRoomID));
  // User's profile
  const userProfile = useSelector(getUserInfo);
  // Modal's visibility
  const [modalInfoVisible, setModaInfoVisible] = useState(false);
  // Reference to the modal's previous visibility
  const prevRefModalInfoVisible = useRef(modalInfoVisible);
  // App Navigation
  const navigation = useNavigation();
  // The image of the room
  const imageSource = useSelector(getImageContent(userRoom.image));

  // Determines if the chat is visible
  useEffect(() => {
    /**
     * Handles whether the user's chat is visible
     */
    // If the modal info was exited, the chat is visible again
    if (prevRefModalInfoVisible.current && !modalInfoVisible) {
      dispatch(setChatOpenedAndVisible(true));
    }
    // If the modal info was entered, the chat isn't visible
    else if (!prevRefModalInfoVisible.current && modalInfoVisible) {
      dispatch(setChatOpenedAndVisible(false));
    }

    /**
     * Handles whether or not the modal info should remain visible
     * or be dismissed
     */
    // If the user's selected room ID changes, the modal is dismissed
    if (userSelectedRoomID !== userSelectedRoomIDRef.current) {
      setModaInfoVisible(false);
    }

    // Updates the modal info visibile reference
    prevRefModalInfoVisible.current = modalInfoVisible;
    // Updates the user selected room ID reference
    userSelectedRoomIDRef.current = userSelectedRoomID;
  }, [modalInfoVisible, userSelectedRoomID]);

  // Sets the chat is visible and opened on first launch of this component
  useEffect(() => {
    dispatch(setChatOpenedAndVisible(true));
  }, []);

  /**
   * Attempts to remove all notifications associated with the room whenever
   * a chat is visible
   */
  useEffect(() => {
    if (ischatOpenedAndVisible) removeNotificationsInTray(userSelectedRoomID);
  }, [ischatOpenedAndVisible]);

  if (
    JSON.stringify(userRoom) !== JSON.stringify({}) &&
    JSON.stringify(userProfile) !== JSON.stringify({})
  ) {
    return (
      <View style={styles.appBarContainer}>
        <View style={styles.navigationButton}>
          <Icon
            name="arrow-circle-left"
            type="font-awesome-5"
            color="white"
            size={30}
            onPress={() => {
              // Saves that a chat is no longer opened and visible
              dispatch(setChatOpenedAndVisible(false));
              // Navigates to the user's list of rooms
              navigation.navigate(ScreenNames.rooms);
            }}
          />
        </View>
        <View style={styles.chatName}>
          <Image
            style={styles.image}
            source={
              imageSource
                ? {
                    uri: `data:image/gif;base64,${imageSource}`,
                  }
                : getRoomImage(userRoom, userProfile.ID)
            }
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
              // Saves that a chat is no longer opened and visible
              dispatch(setChatOpenedAndVisible(false));
              // Opens the modal
              setModaInfoVisible(true);
            }}
          />
        </View>
        <ChatInfo visible={modalInfoVisible} setVisible={setModaInfoVisible} />
      </View>
    );
  } else {
    // Navigates to the user's list of rooms
    navigation.navigate(ScreenNames.rooms);
    // Returns an empty component
    return null;
  }
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
