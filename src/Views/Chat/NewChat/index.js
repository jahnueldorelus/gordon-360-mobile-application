import React, { useState } from "react";
import { View, StyleSheet, Modal, SafeAreaView } from "react-native";
import { getUserImage } from "../../../Services/Messages/index";
import {
  getPeopleSearchResults,
  getPeopleSearchLoading,
} from "../../../store/entities/peopleSearch";
import { SearchHeader } from "./Components/SearchHeader";
import { SelectedUsers } from "./Components/SelectedUsers/index";
import { SearchResults } from "./Components/SearchResults/index";
import { SearchFilter } from "./Components/SearchFilter/index";
import { SearchTooltip } from "./Components/SearchTooltip/index";
import { useSelector } from "react-redux";

export const NewChat = (props) => {
  // The user's search text
  const [searchedText, setSearchedText] = useState("");

  // Object of selected users
  const [selectedUsers, setSelectedUsers] = useState({});

  // People Search filter visibility
  const [filterVisible, setFilterVisible] = useState(true);

  // The people search's result
  const searchResult = useSelector(getPeopleSearchResults);

  // The people search's loading status
  const searchResultLoading = useSelector(getPeopleSearchLoading);

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
        a.NickName !== a.FirstName && b.NickName !== b.FirstName
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
   * Do not move this code to the beginning of the file. The
   * code uses "sortUsersAlphabetically" whose function is
   * required to be defined before being used.
   */
  // The search results of users sorted in alphabetical order
  const searchResultList = sortUsersAlphabetically(searchResult);
  // The list of selected users
  const selectedUsersList = Object.values(selectedUsers);

  return (
    <Modal
      visible={props.visible}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={() => props.setVisible(false)}
      onDismiss={() => props.setVisible(false)}
    >
      <SearchHeader
        searchedText={searchedText}
        setSearchedText={setSearchedText}
        setSelectedUsers={setSelectedUsers}
        searchResultList={searchResultList}
        setVisible={props.setVisible}
      />
      <View style={styles.modal}>
        <SafeAreaView style={{ flex: 1 }}>
          <SelectedUsers
            handleSelected={handleSelected}
            getUserFullName={getUserFullName}
            selectedUsers={selectedUsersList}
          />
          {searchedText.length > 1 ? (
            <SearchResults
              searchedText={searchedText}
              searchResultList={searchResultList}
              resultLoading={searchResultLoading}
              selectedUsers={selectedUsers}
              getUserImage={getUserImage}
              getUserFullName={getUserFullName}
              handleSelected={handleSelected}
            />
          ) : (
            <SearchTooltip selectedUsers={selectedUsersList} />
          )}
        </SafeAreaView>
      </View>

      <SearchFilter visible={filterVisible} setVisible={setFilterVisible} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { flex: 1 },
});
