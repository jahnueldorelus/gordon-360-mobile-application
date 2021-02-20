import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
          onChangeText={(text) => {
            props.setSearchedText(text);
            // Does a search if the text length is greater than 1
            if (text.length > 1) {
              const name = text.split(" ");
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
            // Resets the search results if the text length is less than 2
            else {
              if (props.searchResultList.length > 0)
                dispatch(resetSearchList());
            }
          }}
          value={props.searchedText}
          round
          lightTheme
          containerStyle={styles.searchBarContainer}
          platform="ios"
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
          cancelButtonProps={{ buttonTextStyle: styles.searchBarCancelButton }}
        />
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
