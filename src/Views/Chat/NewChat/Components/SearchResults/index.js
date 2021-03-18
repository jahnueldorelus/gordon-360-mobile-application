import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Image,
  ScrollView,
} from "react-native";
import { getSelectedItemsAndNames } from "../../../../../store/ui/peopleSearchFilter";
import { Icon } from "react-native-elements";
import { SearchTooltip } from "../../Components/SearchTooltip/index";
import { useSelector } from "react-redux";

export const SearchResults = (props) => {
  // The reference to the scrollview that handles the people search results
  const searchResultsScrollRef = useRef();

  // The object of seleced filters
  const selectedFilterData = useSelector(getSelectedItemsAndNames);

  // The reference to selected filters that will be displayed
  const selectedFilters = useRef(selectedFilterData.nameAndItem);

  // A reference to the previous search results
  const prevSearchResults = useRef(props.searchResultList);

  // Determines if selected all checkbox is selected
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Object of selected users that were selected with the "Select All" option
  const [selectAllUsers, setSelectAllUsers] = useState({});

  /**
   * Determines if a user has already been selected
   * @param {String} userFullName The user's full name
   */
  const isSelected = (userFullName) => {
    return props.selectedUsers[userFullName] ? true : false;
  };

  useEffect(() => {
    if (props.resultLoading) {
      selectedFilters.current = selectedFilterData.nameAndItem;
    }
  }, [props.resultLoading]);

  useEffect(() => {
    // List of user names in the search result list
    const searchResultNames = props.searchResultList.map((user) =>
      props.getUserFullName(user)
    );
    // List of user names in the selected users list
    const selectedNames = Object.values(props.selectedUsers).map((user) =>
      props.getUserFullName(user)
    );

    // If all users in the search result are selected, then the select all button is true
    if (
      searchResultNames.every((username) => selectedNames.includes(username))
    ) {
      setIsAllSelected(true);
      // The list of users in the "Select All" list changes to the new search result list
      setSelectAllUsers(props.searchResultList);
    }
    // Since this is a new list, the select button is reset to handle the new search result list
    else {
      setIsAllSelected(false);
    }
  }, [props.searchResultList, props.selectedUsers]);

  /**
   * Determines whether to select or deselect all users
   * @param {Boolean} selectAll Determines if all users should be selected
   */
  const handleAllSelected = (selectAll) => {
    // All users in the selected users list
    let newSelectedUsers = { ...props.selectedUsers };
    // All users selected with the "Select All" option
    let newAllSelectUsers = {};

    // Selects all users from search result
    if (selectAll) {
      /**
       * Adds all users from search result that's not already selected
       * to the new list of selected users
       */
      props.searchResultList.forEach((user) => {
        newSelectedUsers[props.getUserFullName(user)] = user;
        newAllSelectUsers[props.getUserFullName(user)] = user;
      });
      setSelectAllUsers(newAllSelectUsers);
      props.setSelectedUsers({ ...props.selectedUsers, ...newSelectedUsers });
    }
    // Deselects all users from search result
    else {
      /**
       * Removes all users in the search result from the new list of selected users
       */
      Object.values(selectAllUsers).forEach((user) => {
        if (newSelectedUsers[props.getUserFullName(user)]) {
          delete newSelectedUsers[props.getUserFullName(user)];
        }
      });
      props.setSelectedUsers(newSelectedUsers);
    }
  };

  /**
   * Renders an item of the list of selected users
   * Do not move this into Flatlist. With it being separate
   * and the use of useCallback, this creates a performance boost
   */
  const renderItem = useCallback(
    ({ item, index }) => {
      // Determines if a user is selected
      const userIsSelected = isSelected(props.getUserFullName(item));

      return (
        <View>
          <TouchableHighlight
            underlayColor="none"
            onPress={() => props.handleSelected(item)}
          >
            <View style={styles.itemContainer}>
              <View style={styles.itemImageContainer}>
                <Image
                  source={props.getUserImage(item.image)}
                  style={styles.itemImage}
                />
              </View>
              <View style={styles.itemContentContainer}>
                <View style={styles.itemContent}>
                  <View style={styles.itemContentUserInfo}>
                    <Text style={styles.itemContentUserType}>{item.Type}</Text>
                    <Text style={styles.itemContentUserName}>
                      {props.getUserFullName(item)}
                    </Text>
                  </View>
                  <Icon
                    name={userIsSelected ? "check-circle" : "circle"}
                    type="font-awesome-5"
                    color={userIsSelected ? "white" : "#013e70"}
                    iconStyle={{
                      backgroundColor: userIsSelected ? "#013e70" : "white",
                    }}
                    containerStyle={styles.itemContentCheckmarkIconContainer}
                    size={25}
                  />
                </View>
                <View
                  style={[
                    styles.itemContentBorderBottom,
                    {
                      // Adds a bottom border to all items expect for the last one
                      borderBottomWidth:
                        index === props.searchResultList.length - 1 ? 0 : 1,
                    },
                  ]}
                />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      );
    },
    [props.searchResultList]
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Displays the "Select All" checkbox if the search result has multple users */}
      {props.searchResultList.length > 1 && (
        <View style={styles.selectAllContainer}>
          <TouchableHighlight
            onPress={() => {
              // Changes the state to determine if all users are selected
              setIsAllSelected(!isAllSelected);
              // Changes the list of selected users to all or no users
              handleAllSelected(!isAllSelected);
            }}
            underlayColor="none"
            style={styles.selectAllButtonContainer}
          >
            <View style={styles.selectAllButton}>
              <Icon
                name={isAllSelected ? "check-square" : "square"}
                type="font-awesome-5"
                color="#354f86"
                size={25}
                containerStyle={styles.selectAllButtonIcon}
              />
              <Text style={styles.selectAllButtonText}>Select All Users</Text>
            </View>
          </TouchableHighlight>
        </View>
      )}
      <FlatList
        ref={searchResultsScrollRef}
        style={styles.listContainer}
        data={props.searchResultList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="always"
        contentContainerStyle={[
          styles.listContentContainerStyle,
          props.searchResultList.length ? null : { justifyContent: "center" },
        ]}
        onContentSizeChange={() => {
          /**
           * Scrolls all the way back to the top of the list when new search results
           * are given. Each list is converted by JSON in order to properly check
           * equality for a list of objects
           */
          if (
            JSON.stringify(prevSearchResults.current) !==
            JSON.stringify(props.searchResultList)
          ) {
            searchResultsScrollRef.current.scrollToOffset({
              animated: true,
              offset: 0,
            });

            // Updates the previous search results with the new list
            prevSearchResults.current = props.searchResultList;
          }
        }}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          // If the search result data isn't loading
          if (!props.resultLoading) {
            const lastSearchedText = props.lastSearchedText.trim();

            /**
             * If there's searched text, the searched text is displayed
             * Otherwise, the selected filters and their values are displayed
             */
            if (lastSearchedText) {
              return (
                <View style={styles.emptyList}>
                  <Image
                    source={require("../../Images/empty-list.png")}
                    style={styles.emptyListImage}
                  />
                  <Text style={styles.emptyListTextOne}>
                    No results found for '
                    {
                      <Text style={styles.emptyListTextTwo}>
                        {props.lastSearchedText}
                      </Text>
                    }
                    '.
                  </Text>
                </View>
              );
            } else if (
              !lastSearchedText &&
              selectedFilters.current.length > 0
            ) {
              return (
                <ScrollView contentContainerStyle={styles.emptyListScrollView}>
                  <View style={styles.emptyListFilterView}>
                    <Image
                      source={require("../../Images/empty-list.png")}
                      style={styles.emptyListImage}
                    />
                    <Text style={styles.emptyListTextOne}>
                      No results found for the filters:
                    </Text>
                    <View style={styles.emptyListFilterContainer}>
                      {selectedFilters.current.map((filter, index) => (
                        <View key={index} style={styles.emptyListFilter}>
                          <Text
                            key={index}
                            style={styles.emptyListFilterTextOne}
                          >
                            {filter.name}:
                          </Text>
                          <Text style={styles.emptyListFilterTextTwo}>
                            {filter.item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              );
            } else {
              return <SearchTooltip />;
            }
          } else {
            return (
              <View style={styles.loadingImageContainer}>
                <Image
                  source={require("../Images/mascot.png")}
                  style={styles.loadingImage}
                />
                <Text style={styles.loadingImageText}>Searching...</Text>
              </View>
            );
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectAllContainer: {
    backgroundColor: "white",
    paddingHorizontal: "5%",
    borderColor: "#354f86",
    borderWidth: 0.1,
  },
  selectAllButtonContainer: {
    alignSelf: "flex-start",
    marginVertical: 8,
  },
  selectAllButton: { flexDirection: "row", alignItems: "center" },
  selectAllButtonIcon: { marginRight: 8 },
  selectAllButtonText: { fontSize: 17, fontWeight: "bold", color: "#354f86" },
  listContainer: { backgroundColor: "white" },
  listContentContainerStyle: { flexGrow: 1 },
  itemContainer: {
    marginHorizontal: 20,
    marginTop: 5,
    borderRadius: 5,
    flexDirection: "row",
  },
  itemImageContainer: { alignSelf: "center" },
  itemImage: {
    width: 40,
    height: 40,
    borderColor: "#0a5289",
    borderWidth: 1,
    borderRadius: 50,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemContentContainer: { flex: 1, justifyContent: "space-between" },
  itemContentUserInfo: {
    flex: 1,
    margin: 10,
  },
  itemContentUserType: { color: "#1f4665", fontSize: 15 },
  itemContentUserName: {
    color: "#013e70",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemContentCheckmarkIconContainer: { borderRadius: 50 },
  itemContentBorderBottom: {
    borderColor: "#0a5289",
    width: "100%",
    alignSelf: "center",
  },
  emptyList: {
    alignItems: "center",
  },
  emptyListImage: {
    width: 150,
    height: 150,
    backgroundColor: "white",
    tintColor: "#013e83",
    marginBottom: 20,
  },
  emptyListTextOne: {
    fontSize: 20,
    color: "#014983",
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyListTextTwo: {
    fontStyle: "italic",
    fontWeight: "normal",
  },
  emptyListScrollView: {
    flex: 1,
    paddingVertical: 40,
  },
  emptyListFilterView: {
    alignItems: "center",
  },
  emptyListFilterContainer: {
    flex: 1,
    marginTop: 20,
    maxWidth: "80%",
  },
  emptyListFilter: {
    flex: 1,
  },
  emptyListFilterTextOne: {
    fontSize: 20,
    color: "#014983",
    fontWeight: "bold",
    marginTop: 20,
  },
  emptyListFilterTextTwo: {
    fontSize: 20,
    color: "#014983",
    fontStyle: "italic",
  },
  emptyListFilterTextSeparator: {
    borderWidth: 0.5,
    borderColor: "#014983",
    width: "50%",
    alignSelf: "center",
    marginVertical: 10,
  },
  loadingImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  loadingImage: {
    resizeMode: "contain",
    width: "50%",
    height: "50%",
  },
  loadingImageText: {
    marginTop: 20,
    fontSize: 30,
    color: "#014983",
    fontWeight: "bold",
    textAlign: "center",
  },
});
