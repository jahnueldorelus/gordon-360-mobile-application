import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
} from "react-native";
import {
  searchForPeople,
  ui_PeopleSearchResetState,
} from "../../../../../store/ui/peopleSearch";
import {
  getSelectedItemsAndNames,
  ui_PeopleSearchFilterResetState,
} from "../../../../../store/ui/peopleSearchFilter";
import { Icon, SearchBar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceOrientation } from "../../../../../store/ui/app";

export const SearchHeader = (props) => {
  // Configures the animation for the component
  LayoutAnimation.easeInEaseOut();

  // Redux Dispatch
  const dispatch = useDispatch();

  // The object of seleced filters
  const selectedFilterData = useSelector(getSelectedItemsAndNames);
  // The device's orientation
  const screenOrientation = useSelector(getDeviceOrientation);

  // The user's search text
  const [searchedText, setSearchedText] = useState("");

  /**
   * Determines if users can be searched.
   * Users can be searched only if there are filters enabled and if
   * there's at least 1 number or letter in the text
   */
  const canSearchUsers = () => {
    return (
      (searchedText.length > 0 &&
        // This checks to make sure the text contains at least 1 letter or number
        (/\d/.test(searchedText) || /[a-zA-Z]/.test(searchedText))) ||
      selectedFilterData.nameAndItem.length > 0
    );
  };

  /**
   * Searched the users based upon the name and filters applied
   * if users can be searched.
   */
  const searchUsers = () => {
    if (canSearchUsers()) {
      // Splits the search bar's text to retrieve first and last name
      const name = searchedText.split(" ");

      // Dispatches the search
      dispatch(
        searchForPeople({
          includeAlumni: false,
          firstName: name[0] ? name[0] : "",
          lastName: name[1] ? name[1] : "",
          ...selectedFilterData.items,
        })
      );
    }
  };

  const submitSearch = () => {
    // Closes filter if opened
    props.data.setFilterVisible(false);
    // Dismisses the Keyboard if opened
    Keyboard.dismiss();
    // Saves the searched text as the last searched text
    props.data.setLastSearchedText(searchedText);
    // Searches for people based upon the user's search text
    searchUsers();
  };

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#014983", "#015483"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.gradient,
        { flex: screenOrientation === "landscape" ? 1 : 0 },
      ]}
    >
      <View style={styles.title}>
        <Text style={styles.titleText}>Create a New Chat</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          title="Close Modal"
          onPress={() => {
            // Resets the saved states
            props.data.setSelectedUsers({});
            setSearchedText("");
            props.data.setLastSearchedText("");
            dispatch(ui_PeopleSearchFilterResetState());
            dispatch(ui_PeopleSearchResetState());
            // Ensures the filters are closed
            props.data.setFilterVisible(false);
            // Closes out the Modal
            props.data.setVisible(false);
          }}
        >
          <Icon name="close" type="material" color="white" size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <SearchBar
          placeholder="Search People Here..."
          onFocus={() => props.data.setFilterVisible(false)}
          value={searchedText}
          round
          lightTheme
          containerStyle={styles.searchBarContainer}
          platform="ios"
          onChangeText={(text) => {
            setSearchedText(text.trimStart());
          }}
          onSubmitEditing={() => {
            submitSearch();
          }}
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
          cancelButtonProps={{ buttonTextStyle: styles.searchBarCancelButton }}
        />
        {selectedFilterData.nameAndItem.length > 0 && (
          <Text
            style={{
              marginHorizontal: 14,
              color: "white",
              marginBottom: 10,
              fontWeight: "bold",
            }}
          >
            Filtering By:{" "}
            {selectedFilterData.nameAndItem.map((filter, index) => (
              <Text
                key={index}
                style={{ fontWeight: "normal", fontStyle: "italic" }}
              >
                {index !== selectedFilterData.nameAndItem.length - 1
                  ? `${filter.name},${" "}`
                  : filter.name}
              </Text>
            ))}
          </Text>
        )}
        <View style={styles.filterAndSearchContainer}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              props.data.setFilterVisible(!props.data.filterVisible);
              Keyboard.dismiss();
            }}
            containerStyle={styles.filterButtonContainer}
          >
            <View style={styles.filterButton}>
              <Icon
                name={"filter"}
                type="material-community"
                color="white"
                size={25}
                containerStyle={styles.filterButtonIcon}
              />
              <Text style={styles.filterButtonText}>
                {props.data.filterVisible ? "Close Filters" : "Open Filters"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            disabled={!canSearchUsers()}
            onPress={() => {
              submitSearch();
            }}
            style={styles.searchButtonContainer}
          >
            <View
              style={[
                styles.searchButton,
                { opacity: canSearchUsers() ? 1 : 0.4 },
              ]}
            >
              <Icon
                name={"search"}
                type="font-awesome-5"
                color="#014983"
                size={16}
                containerStyle={styles.searchButtonIcon}
              />
              <Text style={styles.searchButtonText}>Search</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  title: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    width: "80%",
    marginTop: 20,
  },
  titleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  filterAndSearchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8,
    alignItems: "center",
  },
  filterButtonContainer: { alignSelf: "flex-start" },
  filterButton: { flexDirection: "row", alignItems: "center" },
  filterButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  filterButtonIcon: { marginRight: 2 },
  searchButtonContainer: { alignSelf: "flex-end" },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 3,
  },
  searchButtonText: {
    color: "#014983",
    fontSize: 17,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  searchButtonIcon: { marginRight: 5 },
  searchBar: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  searchBarContainer: { backgroundColor: "transparent" },
  searchBarInputContainer: { backgroundColor: "#e6f4ff" },
  searchBarInput: { color: "#012849" },
  searchBarCancelButton: { color: "white" },
  gradient: { backgroundColor: "blue" },
});
