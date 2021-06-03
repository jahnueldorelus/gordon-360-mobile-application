import React, { useRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Icon } from "react-native-elements";

export const SelectedUsers = (props) => {
  /**
   * Variables used to determine if the scroll bar for the selected users should
   * scroll all the way to the end of the list. The scroll bar will automatically
   * scroll itself to the end of the list if a new user is added.
   */
  const [initialViewWidth, setInitialViewWidth] = useState(null);
  const usersSelectedScrollRef = useRef();
  const oldViewWidthRef = useRef(0);
  const numOfUsers = useRef(props.data.selectedUsers.length);
  // Determines if the helper tool for scrolling the users should appear
  const [showUserScrollTooltip, setShowUserScrollTooltip] = useState(false);

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
   * Do not move this into Flatlist. With it being separate
   * and the use of useCallback, this creates a performance boost
   */
  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View
          style={[
            styles.itemContainer,
            {
              marginRight:
                index !== props.data.selectedUsers.length - 1 ? 10 : 0,
            },
          ]}
        >
          <Text style={styles.itemTitle}>
            {props.data.getUserFullName(item)}
          </Text>
          <Icon
            name="close"
            type="material"
            color="white"
            size={20}
            containerStyle={styles.itemIcon}
            onPress={() => props.data.handleSelected(item)}
          />
        </View>
      );
    },
    [props.data.selectedUsers]
  );

  // Returns the list if there's a list of selected users
  if (props.data.selectedUsers.length > 0) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.tooltipText}>
          {showUserScrollTooltip
            ? "Scroll to view all selected users"
            : "Selected Users"}
        </Text>
        <FlatList
          ref={usersSelectedScrollRef}
          data={props.data.selectedUsers}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={1}
          showsHorizontalScrollIndicator
          horizontal
          initialNumToRender={250}
          contentContainerStyle={[
            {
              padding: props.data.selectedUsers.length > 0 ? 10 : 0,
              paddingBottom: props.data.selectedUsers.length > 0 ? 15 : 0,
            },
          ]}
          onContentSizeChange={(width) => {
            const newWidth = width - 20; // 20 is subtracted to exclude horizontal padding

            /**
             * Scrolls to the end of the list only if a new user has been added.
             * This is done by evaluating the new width. If the new width is greater
             * than the old width and the new width surpasses the initial width of
             * the scroll bar (aka the user chip is rendered off screen), then the
             * scroll bar scrolls to the end of the list so that the user added can be seen.
             */
            if (
              newWidth > initialViewWidth &&
              newWidth > oldViewWidthRef.current &&
              props.data.selectedUsers.length > numOfUsers.current
            ) {
              // Scrolls to the end of the list
              usersSelectedScrollRef.current.scrollToEnd({
                /**
                 * If all users in the search result list were selected,
                 * no animation is done for faster performance
                 */
                animated: props.data.isAllSelected ? false : true,
              });
            }

            // Sets the new number of users ref
            numOfUsers.current = props.data.selectedUsers.length;

            // Sets the visibility of the selected user list scroll tooltip
            newWidth > initialViewWidth
              ? setShowUserScrollTooltip(true)
              : setShowUserScrollTooltip(false);

            // Sets the old with equal to the new width
            oldViewWidthRef.current = newWidth;
          }}
          onLayout={({ nativeEvent }) => {
            /**
             * Sets the initial width of the scroll bar on the entire screen.
             * This value never changes. It will always remain as the width of the
             * scroll bar when it was first rendered.
             */
            if (!initialViewWidth)
              setInitialViewWidth(nativeEvent.layout.width);
            // Also sets the old width of the scroll bar as the initial width
            if (oldViewWidthRef.current === 0)
              oldViewWidthRef.current = nativeEvent.layout.width;
          }}
          renderItem={renderItem}
        />

        {props.data.selectedUsers.length > 0 && (
          <View style={styles.bottomBorder} />
        )}
      </View>
    );
  } else {
    // Since there isn't any selected users, nothing is shown
    return <></>;
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    backgroundColor: "#014983",
    paddingVertical: 8,
    paddingLeft: 17,
    paddingRight: 10,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitle: {
    color: "white",
    marginRight: 10,
    fontWeight: "bold",
  },
  itemIcon: {
    backgroundColor: "#001e35",
    borderRadius: 50,
    padding: 1,
  },
  tooltipText: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 10,
    fontWeight: "bold",
    color: "#014983",
    marginHorizontal: 10,
  },
  bottomBorder: {
    borderColor: "#0a5289",
    borderBottomWidth: 1,
    width: "100%",
    alignSelf: "center",
  },
});
