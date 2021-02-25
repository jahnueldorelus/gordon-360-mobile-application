import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import {
  searchForPeople,
  resetSearchList,
} from "../../../../../store/entities/peopleSearch";
import { Icon, SearchBar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

export const SearchHeader = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  /**
   * Determines if users can be searched.
   * Users can be searched only if the length of the text
   * in the search bar is at least 2
   */
  const canSearchUsers = () => {
    return props.searchedText.length >= 2;
  };

  /**
   * Searched the users based upon the name and filters applied
   * if users can be searched.
   */
  const searchUsers = () => {
    if (canSearchUsers()) {
      // Splits the search bar's text to retrieve first and last name
      const name = props.searchedText.split(" ");

      // Dispatches the search
      dispatch(
        searchForPeople({
          includeAlumni: false,
          firstName: name[0] ? name[0] : "",
          lastName: name[1] ? name[1] : "",
          major: "",
          minor: "",
          hall: "",
          classType: "",
          homeCity: "",
          state: "",
          country: "",
          department: "",
          building: "",
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
            props.setSearchedText("");
            dispatch(resetSearchList());
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
          value={props.searchedText}
          round
          lightTheme
          containerStyle={styles.searchBarContainer}
          platform="ios"
          onChangeText={(text) => {
            props.setSearchedText(text);
            dispatch(resetSearchList());
          }}
          onSubmitEditing={() => {
            searchUsers();
          }}
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
          cancelButtonProps={{ buttonTextStyle: styles.searchBarCancelButton }}
        />
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
                name={props.filterVisible ? "remove" : "add"}
                type="material"
                color="white"
                size={25}
                containerStyle={styles.filterButtonIcon}
              />
              <Text style={styles.filterButtonText}>
                {props.filterVisible ? "Close Filters" : "Show Filters"}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            underlayColor="none"
            disabled={!canSearchUsers()}
            onPress={() => {
              Keyboard.dismiss();
              searchUsers();
            }}
            containerStyle={styles.searchButtonContainer}
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
  filterButtonIcon: { marginRight: 5 },
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
