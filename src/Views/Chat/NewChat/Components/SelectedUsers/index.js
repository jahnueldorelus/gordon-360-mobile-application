import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  LayoutAnimation,
} from "react-native";
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
  // Determines if the helper tool for scrolling the users should appear
  const [showUserScrollTooltip, setShowUserScrollTooltip] = useState(false);

  // Configures the animation for the component
  LayoutAnimation.easeInEaseOut();

  return (
    <View style={styles.mainContainer}>
      {props.selectedUsers.length > 0 && (
        <Text style={styles.tooltipText}>
          {showUserScrollTooltip
            ? "Scroll to view all selected users"
            : "Selected Users"}
        </Text>
      )}
      <FlatList
        ref={usersSelectedScrollRef}
        data={props.selectedUsers}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator
        horizontal
        contentContainerStyle={[
          {
            padding: props.selectedUsers.length > 0 ? 10 : 0,
            paddingBottom: props.selectedUsers.length > 0 ? 15 : 0,
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
            newWidth > oldViewWidthRef.current
          ) {
            usersSelectedScrollRef.current.scrollToEnd({
              animated: true,
            });
          }

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
          if (!initialViewWidth) setInitialViewWidth(nativeEvent.layout.width);
          // Also sets the old width of the scroll bar as the initial width
          if (oldViewWidthRef.current === 0)
            oldViewWidthRef.current = nativeEvent.layout.width;
        }}
        renderItem={({ item, index }) => {
          return (
            <View
              style={[
                styles.itemContainer,
                {
                  marginRight:
                    index !== props.selectedUsers.length - 1 ? 10 : 0,
                },
              ]}
            >
              <Text style={styles.itemTitle}>
                {props.getUserFullName(item)}
              </Text>
              <Icon
                name="close"
                type="material"
                color="white"
                size={20}
                containerStyle={styles.itemIcon}
                onPress={() => props.handleSelected(item)}
              />
            </View>
          );
        }}
      />

      {props.selectedUsers.length > 0 && <View style={styles.bottomBorder} />}
    </View>
  );
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
