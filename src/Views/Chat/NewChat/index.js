import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
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

export const NewChat = (props) => {
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
   * @returns {boolean} Determines if a chat already exists
   */
  const doesChatExist = () => {
    // Determines if the chat exists
    const chatAlreadyExists = false;

    // Parses through the user's list of chats
    userRooms.every((room) => {
      // If a chat already exists, the list of the user's chats stops iterating
      if (chatAlreadyExists) return false;
      // console.log(room);

      // If a chat has the same length as the selected users
      if (room.users.length === selectedUsersList.length) {
        // Determines if every user in the chat is in the list of selected users
        let allUsersPresent = true;

        // List of usernames of each user in the chat
        const roomUsers = room.users.map((user) => user.username);
        // List of usernames of each user in the selected users list
        const selectedUsersNames = selectedUsersList.map(
          (user) => user.AD_Username
        );

        // console.log({ room: roomUsers, selected: selectedUsers });
        // Checks to see if each user in the list is located in the list of selected users
        roomUsers.every((user) => {
          // If a user in a chat isn't present in the list of selected users
          if (!selectedUsersNames.includes(user)) {
            // Sets that not all users in the chat are present in the list of selected users
            allUsersPresent = false;
            // Stops the iteration of the list of users in the chat
            return false;
          }
        });

        // If all the users are present, then the chat already exists
        if (allUsersPresent) chatAlreadyExists = true;
      }
    });

    // console.log("Chat already exists:", chatAlreadyExists);
    return chatAlreadyExists;
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
                  if (doesChatExist()) {
                    Alert.alert(
                      "Existent Chat",
                      "A chat already exists with the users you've selected. Please remove or add more users to create a new chat.",
                      [
                        {
                          text: "Okay",
                          onPress: () => {}, // Does nothing
                          style: "cancel",
                        },
                      ]
                    );
                  } else {
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
            setNewChatModalVisible: props.setVisible,
            setSelectedUsers,
            setLastSearchedText,
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
});
