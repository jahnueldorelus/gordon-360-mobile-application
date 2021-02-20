import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Image,
} from "react-native";
import { Icon } from "react-native-elements";

export const SearchResults = (props) => {
  // The reference to the scrollview that handles the people search results
  const searchResultsScrollRef = useRef();

  /**
   * Determines if a user has already been selected
   * @param {String} userFullName The user's full name
   */
  const isSelected = (userFullName) => {
    return props.selectedUsers[userFullName] ? true : false;
  };

  return (
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
        // Scrolls all the way back to the top of the list
        // when new search results are given
        searchResultsScrollRef.current.scrollToOffset({
          animated: true,
          offset: 0,
        });
      }}
      renderItem={({ item, index }) => {
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
                      <Text style={styles.itemContentUserType}>
                        {item.Type}
                      </Text>
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
      }}
      ListEmptyComponent={() =>
        !props.resultLoading ? (
          <View style={styles.emptyListItem}>
            <Image
              source={require("../../Images/empty-list.png")}
              style={styles.emptyListItemImage}
            />
            <Text style={styles.emptyListItemTextOne}>
              No results found for '
              {
                <Text style={styles.emptyListItemTextTwo}>
                  {props.searchedText}
                </Text>
              }
              '.
            </Text>
          </View>
        ) : (
          <View></View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
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
  emptyListItem: {
    alignItems: "center",
  },
  emptyListItemImage: {
    width: 150,
    height: 150,
    backgroundColor: "white",
    tintColor: "#013e83",
    marginBottom: 20,
  },
  emptyListItemTextOne: {
    fontSize: 20,
    color: "#014983",
    fontWeight: "bold",
    width: "80%",
    textAlign: "center",
  },
  emptyListItemTextTwo: {
    fontStyle: "italic",
    fontWeight: "normal",
  },
});
