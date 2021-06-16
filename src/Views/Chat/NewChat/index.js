import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { getPeopleSearchResults } from "../../../store/ui/peopleSearch";
import { SearchHeader } from "./Components/SearchHeader";
import { SelectedUsers } from "./Components/SelectedUsers/index";
import { SearchResults } from "./Components/SearchResults/index";
import { SearchFilter } from "./Components/SearchFilter/index";
import { RoomCreator } from "./Components/RoomCreator/index";
import { useSelector } from "react-redux";
import { getUserRooms } from "../../../store/entities/chat";
import { getDeviceOrientation } from "../../../store/ui/app";
import {
  setRoomID,
  setNewRoomImage,
  setNewRoomName,
} from "../../../store/ui/Chat/chat";
import { ui_PeopleSearchFilterResetState } from "../../../store/ui/peopleSearchFilter";
import { ui_PeopleSearchResetState } from "../../../store/ui/peopleSearch";
import { getUserInfo } from "../../../store/entities/profile";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export const NewChat = (props) => {
  // Redux dispatch
  const dispatch = useDispatch();
  // App navigation
  const navigation = useNavigation();
  // The user's previous search text
  const [lastSearchedText, setLastSearchedText] = useState("");
  // Object of selected users
  const [selectedUsers, setSelectedUsers] = useState({});
  // People Search filter visibility
  const [filterVisible, setFilterVisible] = useState(false);
  // People Search filter visibility
  const [roomMessageVisible, setRoomMessageVisible] = useState(false);
  // The people search's result
  const searchResult = useSelector(getPeopleSearchResults);
  // Determines if select all checkbox is selected
  const [isAllSelected, setIsAllSelected] = useState(false);
  // User rooms
  const userRooms = useSelector(getUserRooms);
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);
  // The user's profile info
  const userProfile = useSelector(getUserInfo);

  /**
   * Sorts the user objects alphabetically.
   * Sorts the users by their first name, then their last name,
   * and lastly, by their nick name if they have one
   * @param {Object} userList The list of users to sort
   */
  const sortUsersAlphabetically = (userList) =>
    userList &&
    userList.slice().sort((a, b) =>
      // Checks to make sure the first names are not the same
      a.FirstName.localeCompare(b.FirstName) !== 0
        ? // Sorts by first name since they're not eqaul
          a.FirstName.localeCompare(b.FirstName)
        : // Checks to make sure the last names are not the same
        a.LastName.localeCompare(b.LastName) !== 0
        ? // Sorts by last name since they're not equal
          a.LastName.localeCompare(b.LastName)
        : // Sorts by nick name (if both users have one)
        a.NickName &&
          a.NickName !== a.FirstName &&
          b.NickName &&
          b.NickName !== b.FirstName
        ? a.NickName.localeCompare(b.NickName)
        : // If user A has a nick name and user B doesn't, user A
        // goes after user B
        a.NickName !== a.FirstName && b.NickName === b.FirstName
        ? 1
        : // If user A has no nick name and user B does, user A
        // goes before user B
        a.NickName === a.FirstName && b.NickName !== b.FirstName
        ? -1
        : // If both users have the same nick name
          0
    );

  // The search results of users sorted in alphabetical order
  const searchResultList = sortUsersAlphabetically(searchResult);

  // The list of selected users
  const selectedUsersList = Object.values(selectedUsers);

  /**
   * Gets the user's full name including their nick name
   * @param {Object} user
   */
  const getUserFullName = (user) => {
    // Checks to make sure each user field is defined
    const firstname = user.FirstName ? user.FirstName : "";
    const lastname = user.LastName ? user.LastName : "";
    const nickname = user.NickName ? user.NickName : firstname;

    return (
      // Creates user's first name and last name
      `${firstname.trim()} ${lastname.trim()}` +
      // Adds the user's nick name if they have one
      `${
        nickname.trim() === firstname.trim()
          ? ""
          : // Don't remove the space at the beginning
            " (" + nickname.trim() + ")"
      }`
    );
  };

  /**
   * Determines whether to select or deselect a user
   * @param {Object} user The user's information
   */
  const handleSelected = (user) => {
    const userFullName = getUserFullName(user);
    /**
     * Checks to see if the item is already in the list. If they
     * are, they will be removed, if they aren't, they will be added
     */
    if (!selectedUsers[userFullName]) {
      // Saves the item object
      setSelectedUsers({
        ...selectedUsers,
        [userFullName]: user,
      });
    } else {
      // Deletes the item object
      let newUserList = { ...selectedUsers };
      delete newUserList[userFullName];
      setSelectedUsers(newUserList);
    }
  };

  /**
   * Determines if a chat with the selected users already exist
   * to prevent duplicate chats
   * @returns {number} If a chat exists, the room ID is returned. Otherwise 0 is returned
   */
  const chatExists = () => {
    // Determines if the chat exists
    let duplicateRoomID = null;

    // Parses through the user's list of chats
    userRooms.every((room) => {
      /**
       * If a chat has the same length as the selected users.
       * The room's users is subtracted by 1 to remove the main user
       */
      if (room.users.length - 1 === selectedUsersList.length) {
        // List of each user's username in the chat
        const roomUsers = room.users
          .map((user) => user.username)
          .filter((user) => user !== userProfile.AD_Username);

        // List of usernames of each user in the selected users list
        const selectedUsersNames = selectedUsersList.map(
          (user) => user.AD_Username
        );

        // Determines if every user in the chat is in the list of selected users
        const allUsersPresent = roomUsers.every((user) =>
          selectedUsersNames.includes(user)
        );

        /**
         * If all the users are present, then the chat already exists
         * and the duplicate room ID is saved
         */
        if (allUsersPresent) duplicateRoomID = room.id;
      }

      // Iterates to the next item if a duplicate chat wasn't found
      return duplicateRoomID ? false : true;
    });

    return duplicateRoomID;
  };

  // Returns the JSX of the selected users
  const getSelectedUsers = () => (
    <SelectedUsers
      data={{
        handleSelected,
        getUserFullName,
        isAllSelected,
        selectedUsers: selectedUsersList,
      }}
    />
  );

  /**
   * Exists out the modal and navigates to the
   * chat screen while resetting necessary values
   */
  const exitModalAndGoToChat = () => {
    // Deletes the user selected room image
    dispatch(setNewRoomImage(null));
    // Deletes the user selected room name
    dispatch(setNewRoomName(""));
    // Exists out of the room message modal
    setRoomMessageVisible(false);
    // Deletes the last searched text
    setLastSearchedText(null);
    // Deletes people search results
    dispatch(ui_PeopleSearchResetState());
    // Deletes people search filters
    dispatch(ui_PeopleSearchFilterResetState());
    // Deletes selected users
    setSelectedUsers({});
    // Exists out the new chat modal
    props.setVisible(false);
    // Navigates to the chat screen
    navigation.navigate("Chat");
  };

  /**
   * Gets the alert message to display if a duplicate chat exists
   * @param {boolean} canGoToChat Determines if the user can go to the existing chat
   */
  const duplicateChatMessage = (canGoToChat) => {
    return (
      "A chat already exists with the" +
      " " +
      (selectedUsersList.length === 1 ? "user" : "users") +
      " " +
      "you've selected. Please" +
      (selectedUsersList.length === 1 ? "" : " remove or") +
      " " +
      "add more users to create a new chat." +
      (canGoToChat ? "\n\nWould you like to go the existing chat?" : "")
    );
  };

  return (
    <Modal
      visible={props.visible}
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <SafeAreaView
        style={[
          styles.safeAreaView,
          {
            flexDirection: screenOrientation === "landscape" ? "row" : "column",
          },
        ]}
      >
        <SearchHeader
          data={{
            setLastSearchedText,
            setSelectedUsers,
            searchResultList,
            setVisible: props.setVisible,
            filterVisible,
            setFilterVisible,
          }}
        />
        <View style={styles.resultsView}>
          {getSelectedUsers()}

          {selectedUsersList.length > 0 && <View style={styles.bottomBorder} />}

          <SearchResults
            data={{
              lastSearchedText,
              searchResultList,
              selectedUsers,
              setSelectedUsers,
              getUserFullName,
              handleSelected,
              isAllSelected,
              setIsAllSelected,
            }}
          />

          {selectedUsersList.length > 0 && (
            <View>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  // Gets the ID of the duplicated room
                  const duplicateRoomID = chatExists();
                  /**
                   * If the duplicated room ID exists, then an alert is shown
                   * to the user showing that a duplicate room exists
                   */
                  if (duplicateRoomID) {
                    Alert.alert("Existent Chat", duplicateChatMessage(true), [
                      {
                        text: "Go to Chat",
                        onPress: () => {
                          // Sets the duplicate room ID as the selected room ID
                          dispatch(setRoomID(duplicateRoomID));
                          // Exists the modal and goes to the chat screen
                          exitModalAndGoToChat();
                        },
                      },
                      {
                        text: "Cancel",
                        onPress: () => {}, // Does nothing
                        style: "cancel",
                      },
                    ]);
                  } else {
                    /**
                     * Since no duplicate room exists, the user can
                     * continue creating a new room
                     */
                    setRoomMessageVisible(true);
                  }
                }}
                style={styles.createChatButton}
              >
                <Icon
                  name={"comments"}
                  type="font-awesome-5"
                  color="white"
                  size={25}
                  containerStyle={{ marginRight: 10 }}
                />
                <Icon
                  name={"chevron-right"}
                  type="font-awesome-5"
                  color="white"
                  size={20}
                />
              </TouchableOpacity>
            </View>
          )}

          {
            /**
             * Blocks the user from selecting any users or
             * removing selected users while the people search
             * filter is visible
             */
            filterVisible && <View style={styles.contentBlocker} />
          }
        </View>
        <SearchFilter visible={filterVisible} setVisible={setFilterVisible} />

        {/* MODAL for finalizing and add a message to the new room */}
        <RoomCreator
          data={{
            visible: roomMessageVisible,
            setVisible: setRoomMessageVisible,
            selectedUsers: getSelectedUsers(),
            selectedUsersList,
            chatExists,
            duplicateChatMessage,
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeAreaView: { flex: 1, backgroundColor: "black" },
  resultsView: { flex: 1, backgroundColor: "black" },
  contentBlocker: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.6)",
    bottom: 0,
    right: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  createChatButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#2f3d49",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomBorder: {
    borderColor: "#0a5289",
    borderBottomWidth: 1,
    width: "100%",
    alignSelf: "center",
  },
});
