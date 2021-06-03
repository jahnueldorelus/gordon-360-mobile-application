import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { getSelectedItemsAndNames } from "../../../../../store/ui/peopleSearchFilter";
import {
  fetchPeoplesImage,
  getSearchResultImages,
  getPeopleSearchLoading,
} from "../../../../../store/ui/peopleSearch";
import { getUserInfo } from "../../../../../store/entities/profile";
import { Icon } from "react-native-elements";
import { SearchTooltip } from "../../Components/SearchTooltip/index";
import { useSelector, useDispatch } from "react-redux";
import { LoadingScreen } from "../../../../../Components/LoadingScreen/index";
import { AppImageViewer } from "../../../../../Components/AppImageViewer";

export const SearchResults = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // The reference to the scrollview that handles the people search results
  const searchResultsScrollRef = useRef();

  // The object of seleced filters
  const selectedFilterData = useSelector(getSelectedItemsAndNames);

  // The reference to selected filters that will be displayed
  const selectedFilters = useRef(selectedFilterData.nameAndItem);

  // A reference to the previous search results
  const prevSearchResults = useRef(props.data.searchResultList);

  // The main user's info
  const userProfile = useSelector(getUserInfo);

  // The object of the search result's people's images
  const searchResultImages = useSelector(getSearchResultImages);

  // The people search's loading status
  const searchResultLoading = useSelector(getPeopleSearchLoading);

  // Object of selected users that were selected with the "Select All" option
  const [selectAllUsers, setSelectAllUsers] = useState({});

  // Image to show in the image viewer
  const [imageToView, setImageToView] = useState(null);

  // Determines if the image viewer should display
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Loading View
  const loadingView = <LoadingScreen loadingText="Searching" />;

  /**
   * Filters a list of people and returns a new list where every user
   * is a person that the main user can select in searching for people
   * to create a new chat with.
   * @param {array} list The list of users to filter
   * @returns A list of people that are selectable by the main user
   */
  const filterNonSelectableUsers = (list) =>
    // Filters the list removing fac/staff that may not be selectable and the main user themselves
    list.filter((user) => isUserSelectable(user) && !isUserSameAsMain(user));

  /**
   * Determines if a user is selectable.
   * If the main user is a student, they can only select students. Otherwise,
   * the main user can select everyone.
   * @param {object} user The user to check to see if they're selectable
   * @returns {boolean} Determines if the user is selectable
   */
  const isUserSelectable = (user) =>
    userProfile &&
    userProfile.PersonType &&
    userProfile.PersonType.toLowerCase().includes("stu") &&
    user.Type &&
    !user.Type.toLowerCase().includes("stu")
      ? false
      : true;

  /**
   * Determines if the user is the same as the main user.
   * If the user is the main user, they aren't selectable
   * @param {object} user The user to check to see if they're selectable
   * @returns {boolean} Determines if the user is selectable
   */
  const isUserSameAsMain = (user) =>
    String(user.AD_Username).toLowerCase() ===
    String(userProfile.AD_Username).toLowerCase()
      ? true
      : false;

  // Selectable users
  const selectableUsers = filterNonSelectableUsers(props.data.searchResultList);

  useEffect(() => {
    // Updates the selected filters
    if (searchResultLoading) {
      selectedFilters.current = selectedFilterData.nameAndItem;
    }
  }, [searchResultLoading]);

  useEffect(() => {
    // List of user names in the search result list
    const searchResultNames = selectableUsers.map((user) =>
      props.data.getUserFullName(user)
    );
    // List of user names in the selected users list
    const selectedNames = Object.values(props.data.selectedUsers).map((user) =>
      props.data.getUserFullName(user)
    );

    // If all users in the search result are selected, then the select all button is true
    if (
      searchResultNames.length > 0 &&
      searchResultNames.every((username) => selectedNames.includes(username))
    ) {
      props.data.setIsAllSelected(true);
      // The list of users in the "Select All" list changes to the new search result list
      setSelectAllUsers(props.data.searchResultList);
    }
    // Since this is a new list, the select button is reset to handle the new search result list
    else {
      props.data.setIsAllSelected(false);
    }
  }, [props.data.searchResultList, props.data.selectedUsers]);

  useEffect(() => {
    // Checks to make sure that there's a new search result list before fetching people's images
    if (
      JSON.stringify(prevSearchResults.current) !==
      JSON.stringify(props.data.searchResultList)
    )
      dispatch(
        fetchPeoplesImage(
          // Checks to see if the people search result has any people
          props.data.searchResultList && props.data.searchResultList.length > 0
            ? props.data.searchResultList.map((person) => person.AD_Username)
            : []
        )
      );
  }, [props.data.searchResultList]);

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
   * Determines whether to select or deselect all users
   * @param {Boolean} selectAll Determines if all users should be selected
   */
  const handleAllSelected = (selectAll) => {
    // All users in the selected users list
    let newSelectedUsers = { ...props.data.selectedUsers };
    // All users selected with the "Select All" option
    let newAllSelectedUsers = {};

    // Selects all users from search result
    if (selectAll) {
      /**
       * Adds all users from search result that's not already selected
       * to the new list of selected users
       */
      selectableUsers
        // Adds those who aren't already selected to the list of those selected
        .forEach((user) => {
          // Adds the user to the list of selected users if not already apart of it
          if (!newSelectedUsers[props.data.getUserFullName(user)])
            newSelectedUsers[props.data.getUserFullName(user)] = user;
          // Adds the user to the list users that were selected if not already apart of it
          if (!newAllSelectedUsers[props.data.getUserFullName(user)])
            newAllSelectedUsers[props.data.getUserFullName(user)] = user;
        });

      // Sets the new selected list of users in this component
      setSelectAllUsers(newAllSelectedUsers);

      // Sets the new selected list of users in parent component
      props.data.setSelectedUsers({
        ...props.data.selectedUsers,
        ...newSelectedUsers,
      });
    }
    // Deselects all users from search result
    else {
      /**
       * Removes all users in the search result from the new list of selected users
       */
      Object.values(selectAllUsers).forEach((user) => {
        if (newSelectedUsers[props.data.getUserFullName(user)]) {
          delete newSelectedUsers[props.data.getUserFullName(user)];
        }
      });

      // Sets the new selected list of users in this component
      setSelectAllUsers(newAllSelectedUsers);

      // Sets the new selected list of users in parent component
      props.data.setSelectedUsers(newSelectedUsers);
    }
  };

  /**
   * Item layout for a FlatList component
   */
  const getItemLayout = useCallback((data, index) => {
    const itemHeight = 100;
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  }, []);

  /**
   * Key extractor for a FlatList component
   */
  const keyExtractor = useCallback((item, index) => index.toString(), []);

  /**
   * Renders an item of the list of selected users
   * Do not move the code below into the Flatlist. With it being separate
   * and the use of useCallback, a performance boost is created
   */
  const renderItem = useCallback(
    ({ item, index }) => {
      // Determines if a user is selected
      const userIsSelected = props.data.selectedUsers[
        props.data.getUserFullName(item)
      ]
        ? true
        : false;

      /**
       * Determines if the main user can select a person
       * If the main user is a student, they can only select other students.
       * Otherwise, they can select everyone (aka the main user is faculty/staff)
       */
      const canMainUserSelectPerson =
        isUserSelectable(item) && !isUserSameAsMain(item);

      return (
        <View style={styles.itemContainer}>
          <View style={styles.itemImageContainer}>
            {searchResultImages[item.AD_Username] &&
            typeof searchResultImages[item.AD_Username] === "string" ? (
              // If the message has an image and the image is a string (aka base64)
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => {
                  setImageToView(searchResultImages[item.AD_Username]);
                  setShowImageViewer(true);
                }}
              >
                <Image
                  source={{
                    uri:
                      "data:image/gif;base64," +
                      searchResultImages[item.AD_Username],
                  }}
                  style={styles.itemImage}
                />
              </TouchableOpacity>
            ) : (
              // Since there's no image, a default image is supplied instead
              <Icon
                name={"user-circle-o"}
                type="font-awesome"
                color="#014983"
                solid={true}
                size={styles.itemImage.height}
              />
            )}
          </View>
          <TouchableHighlight
            underlayColor="none"
            onPress={() => {
              // If the person can be selected
              if (canMainUserSelectPerson) {
                props.data.handleSelected(item);
                // If the person cannot be selected
              } else {
                // Alerts the user the person cannot be selected
                Alert.alert(
                  "Selection Prohibited",
                  isUserSameAsMain(item)
                    ? // If the user clicked on is the same as the main user
                      "You can't start a new chat with yourself!"
                    : // If the user is a faculty or staff and the main user is a student
                      "As a student, creating a new chat with faculty or staff is not allowed.",
                  [
                    {
                      text: "Okay",
                      onPress: () => {}, // Does nothing
                      style: "cancel",
                    },
                  ]
                );
              }
            }}
            style={styles.itemContentContainer}
          >
            <View style={styles.itemContentContainer}>
              <View style={styles.itemContent}>
                <View style={styles.itemContentUserInfo}>
                  <Text
                    style={[
                      styles.itemContentUserType,
                      {
                        color: canMainUserSelectPerson
                          ? // If the user can be selected
                            "#1f4665"
                          : // If the user cannot be selected
                            "#830149",
                      },
                    ]}
                  >
                    {item.Type}
                  </Text>
                  <Text
                    style={[
                      styles.itemContentUserName,
                      {
                        color: canMainUserSelectPerson
                          ? // If the user can be selected
                            "#013e70"
                          : // If the user cannot be selected
                            "#830149",
                        textDecorationLine: canMainUserSelectPerson
                          ? // If the user can be selected
                            "none"
                          : // If the user cannot be selected
                            "line-through",
                      },
                    ]}
                  >
                    {props.data.getUserFullName(item)}
                  </Text>
                </View>
                {/* If the user cannot be selected, a checkbox will not be shown */}
                <Icon
                  name={
                    canMainUserSelectPerson
                      ? // If the user can be selected
                        userIsSelected
                        ? "check-circle"
                        : "circle"
                      : // If the user cannot be selected
                        "ban"
                  }
                  type="font-awesome-5"
                  color={
                    canMainUserSelectPerson
                      ? // If the user can be selected
                        userIsSelected
                        ? "white"
                        : "#013e70"
                      : // If the user cannot be selected
                        "#830149"
                  }
                  iconStyle={{
                    backgroundColor:
                      // If the user can be selected and is selected
                      userIsSelected && canMainUserSelectPerson
                        ? "#013e70"
                        : // If the user cannot be selected or isn't selected
                          "white",
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
                      index === props.data.searchResultList.length - 1 ? 0 : 1,
                  },
                ]}
              />
            </View>
          </TouchableHighlight>
        </View>
      );
    },
    [props.data.searchResultList]
  );

  /**
   * Returns the view for when the search results list
   * is empty
   */
  const renderEmptyListComponent = () => {
    // If the search result data isn't loading
    if (!searchResultLoading) {
      const lastSearchedText = props.data.lastSearchedText
        ? props.data.lastSearchedText.trim()
        : "";

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
                  {props.data.lastSearchedText}
                </Text>
              }
              '.
            </Text>
          </View>
        );
      } else if (!lastSearchedText && selectedFilters.current.length > 0) {
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
                    <Text key={index} style={styles.emptyListFilterTextOne}>
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
      // Since the results are still loading, a loading screen is displayed
      return loadingView;
    }
  };

  /**
   * Handles the size change of the FlatList content container
   */
  const contentContainerSizeChange = () => {
    /**
     * Scrolls all the way back to the top of the list when new search results
     * are given. Each list is converted by JSON in order to properly check
     * equality for a list of objects
     */
    if (
      JSON.stringify(prevSearchResults.current) !==
        JSON.stringify(props.data.searchResultList) &&
      searchResultsScrollRef.current
    ) {
      searchResultsScrollRef.current.scrollToOffset({
        animated: true,
        offset: 0,
      });

      // Updates the previous search results with the new list
      prevSearchResults.current = props.data.searchResultList;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 
          Displays the "Select All" checkbox if the search result has multple users 
          and no further data is loading 
      */}
      {!searchResultLoading && selectableUsers.length > 1 && (
        <View style={styles.selectAllContainer}>
          <TouchableHighlight
            onPress={() => {
              // Changes the state to determine if all users are selected
              props.data.setIsAllSelected(!props.data.isAllSelected);
              // Changes the list of selected users to all or no users
              handleAllSelected(!props.data.isAllSelected);
            }}
            underlayColor="none"
            style={styles.selectAllButtonContainer}
          >
            <View style={styles.selectAllButton}>
              <Icon
                name={props.data.isAllSelected ? "check-square" : "square"}
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
      {!searchResultLoading ? (
        <FlatList
          ref={searchResultsScrollRef}
          style={styles.listContainer}
          data={props.data.searchResultList}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="always"
          contentContainerStyle={[
            styles.listContentContainerStyle,
            props.data.searchResultList.length
              ? null
              : { justifyContent: "center" },
          ]}
          onContentSizeChange={contentContainerSizeChange()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyListComponent()}
        />
      ) : (
        // Shows the loading view until the search request is done
        loadingView
      )}

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
    width: 50,
    height: 50,
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
  itemContentUserType: { fontSize: 15 },
  itemContentUserName: {
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
    backgroundColor: "white",
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
