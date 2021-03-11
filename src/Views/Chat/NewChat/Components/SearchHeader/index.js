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
  resetSearchList,
} from "../../../../../store/ui/peopleSearch";
import { getSelectedItemsAndNames } from "../../../../../store/ui/peopleSearchFilter";
import { Icon, SearchBar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";

export const SearchHeader = (props) => {
  // Configures the animation for the component
  LayoutAnimation.easeInEaseOut();

  // Redux Dispatch
  const dispatch = useDispatch();

  // The object of seleced filters
  const selectedFilterData = useSelector(getSelectedItemsAndNames);

  // The user's search text
  const [searchedText, setSearchedText] = useState("");

  /**
   * Determines if users can be searched.
   * Users can be searched only if the length of the text
   * in the search bar is at least 2
   */
  const canSearchUsers = () => {
    return searchedText.length >= 2;
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

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#014983", "#015483"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.title}>
        <Text style={styles.titleText}>Create a New Chat</Text>
        <TouchableOpacity
          title="Close Modal"
          onPress={() => {
            // Resets the saved states
            props.setSelectedUsers({});
            setSearchedText("");
            props.setLastSearchedText("");
            dispatch(resetSearchList());
            // Ensures the filters are closed
            props.setFilterVisible(false);
            // Closes out the Modal
            props.setVisible(false);
          }}
        >
          <Icon name="close" type="material" color="white" size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <SearchBar
          placeholder="Search People Here..."
          onFocus={() => props.setFilterVisible(false)}
          value={searchedText}
          round
          lightTheme
          containerStyle={styles.searchBarContainer}
          platform="ios"
          onChangeText={(text) => {
            setSearchedText(text);
          }}
          onSubmitEditing={() => {
            searchUsers();
          }}
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
          cancelButtonProps={{ buttonTextStyle: styles.searchBarCancelButton }}
        />
        {selectedFilterData.names.length > 0 && (
          <Text
            style={{
              marginHorizontal: 14,
              color: "white",
              marginBottom: 10,
              fontWeight: "bold",
            }}
          >
            Filtering By:{" "}
            {selectedFilterData.names.map((name, index) => (
              <Text
                key={index}
                style={{ fontWeight: "normal", fontStyle: "italic" }}
              >
                {index !== selectedFilterData.names.length - 1
                  ? `${name},${" "}`
                  : name}
              </Text>
            ))}
          </Text>
        )}
        <View style={styles.filterAndSearchContainer}>
          <TouchableOpacity
            underlayColor="none"
            onPress={() => {
              props.setFilterVisible(!props.filterVisible);
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
                {props.filterVisible ? "Close Filters" : "Open Filters"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            underlayColor="none"
            disabled={!canSearchUsers()}
            onPress={() => {
              // Closes filter if opened
              props.setFilterVisible(false);
              // Dismisses the Keyboard if opened
              Keyboard.dismiss();
              // Saves the searched text as the last searched text
              props.setLastSearchedText(searchedText);
              // Searches for people based upon the user's search text
              searchUsers();
            }}
            style={styles.searchButtonContainer}
          >
            <View
              style={[
                styles.searchButton,
                { opacity: canSearchUsers() ? 1 : 0.15 },
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
