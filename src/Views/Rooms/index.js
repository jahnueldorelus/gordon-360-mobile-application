import React, { useEffect, useRef, useCallback } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  RefreshControl,
  LayoutAnimation,
} from "react-native";
import { getRoomName } from "../../Services/Messages";
import { getReadableDateFormat } from "../../Services/Messages/index";
import { ListItem, Icon } from "react-native-elements";
import {
  getUserRooms,
  fetchRooms,
  fetchMessages,
  fetchChatUsersImages,
  getUserMessages,
  getUserChatLoading,
  getUserRoomsWithNewMessages,
  getChatRequestRoomsError,
  getChatRequestMessagesError,
} from "../../store/entities/chat";
import { getUserInfo } from "../../store/entities/profile";
import { useDispatch, useSelector } from "react-redux";
import { setRoomID, setLoadFullChatData } from "../../store/ui/Chat/chat";
import {
  getShouldNavigateToChat,
  getShouldLoadFullChat,
} from "../../store/ui/Chat/chatSelectors";
import { RoomImage } from "./Components/roomImage";
import { LoadingScreen } from "../../Components/LoadingScreen/index";
import { useNavigation } from "@react-navigation/native";
import { ScreenNames } from "../../../ScreenNames";

const deviceHeight = Dimensions.get("window").height;

export const RoomsList = () => {
  // Redux Dispath
  const dispatch = useDispatch();
  // App navigation
  const navigation = useNavigation();
  // The user's list of rooms
  const rooms = useSelector(getUserRooms);
  // The user's list of rooms with new messages
  const roomsWithNewMessages = useSelector(getUserRoomsWithNewMessages);
  // The user's messages
  const messages = useSelector(getUserMessages);
  // The user's profile info
  const userProfile = useSelector(getUserInfo);
  // The user's chat loading status
  const dataLoading = useSelector(getUserChatLoading);
  // Determines if there was an error in requesting the user's list of rooms
  const chatReqRoomsError = useSelector(getChatRequestRoomsError);
  // Determines if there was an error in requesting the user's list of rooms
  const chatReqMessagesError = useSelector(getChatRequestMessagesError);
  /**
   * Determines if the user's messages should be fetched.
   * This helps prevent multiple fetches for the user's messages from being made
   */
  const shouldFetchMessages = useRef(true);
  // Determines if the app should navigate directly to the chat screen
  const shouldNavigateToChat = useSelector(getShouldNavigateToChat);
  // Determines if the user's chat data should be fetched
  const shouldLoadFullChat = useSelector(getShouldLoadFullChat);

  // Configures the animation for the component
  LayoutAnimation.easeInEaseOut();

  // Re-fetches the user's messages if the rooms list is available
  useEffect(() => {
    // If user's rooms is available
    if (rooms && rooms.length > 0) {
      /**
       * If a fetch for the user's chat data is in progress and
       * their messages should be fetched, their messages are fetched.
       */
      if (dataLoading && shouldFetchMessages.current) {
        // Fetches the users messages
        dispatch(fetchMessages);
        // Fetches the image of each person in each chat
        dispatch(fetchChatUsersImages);
        // Resets the ref to show that the user's messages shouldn't be fetched
        shouldFetchMessages.current = false;
      }
    }
  }, [rooms]);

  // Fetches the user's chat data if it's requested to be fetched
  useEffect(() => {
    if (shouldLoadFullChat) {
      // Sets the ref to show that the user's messages should be fetched
      shouldFetchMessages.current = true;
      // Fetches the user's rooms
      dispatch(fetchRooms);
      // Resets the value of loading the user's chat data
      dispatch(setLoadFullChatData(false));
    }
  }, [shouldLoadFullChat]);

  /**
   * If the app should directly navigate to the chat screen
   * (In Example: if a chat notification is clicked on), then the user
   * is brought straight to the Chat screen
   */
  useEffect(() => {
    // The user will be directed straight to the chat screen
    if (shouldNavigateToChat) {
      // Navigates to the chat screen
      navigation.navigate(ScreenNames.chat);
    }
  }, [shouldNavigateToChat]);

  /**
   * Renders an item of the list of users for the selected room
   * Do not move the code belowo into the Flatlist. With it being separate
   * and the use of useCallback, a performance boost is created
   */
  const renderItem = useCallback(
    ({ item, index }) => {
      const room = item;

      return (
        <ListItem
          containerStyle={{
            ...styles.listItemContainer,
            // Adds a bottom margin to the last item in the list
            marginBottom: index === rooms.length - 1 ? 15 : 0,
          }}
          key={index}
          underlayColor="none"
          onPress={() => {
            // Sets the user's selected room ID
            dispatch(setRoomID(room.id));
            // Navigates to the chat screen
            navigation.navigate(ScreenNames.chat);
          }}
        >
          <RoomImage room={room} />

          <ListItem.Content>
            <View style={styles.listItemHeader}>
              <View style={styles.listItemHeaderTitleContainer}>
                <ListItem.Title
                  numberOfLines={1}
                  style={styles.listItemHeaderTitle}
                >
                  {getRoomName(room, userProfile.ID)}
                </ListItem.Title>
              </View>
              {/* Displays a blue badge if the room has any unopened messages */}
              {roomsWithNewMessages.includes(room.id) && (
                <View style={styles.listItemHeaderIcon}>
                  <Icon
                    name="circle"
                    solid={true}
                    type="font-awesome-5"
                    color="#2484e4"
                    size={12}
                  />
                </View>
              )}
            </View>

            <ListItem.Subtitle numberOfLines={2}>
              {room.lastMessage}
            </ListItem.Subtitle>
            <ListItem.Subtitle
              numberOfLines={1}
              style={styles.listSubTitleDate}
            >
              {getReadableDateFormat(room.lastUpdated)}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      );
    },
    [rooms, roomsWithNewMessages]
  );

  // If all chat data is available
  if (rooms && roomsWithNewMessages && messages && userProfile && !dataLoading)
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          {/* Displays a message to the user if a fetch error occured or their chat data is updating */}
          {(chatReqRoomsError || chatReqMessagesError) && (
            <View style={styles.errorContainer}>
              <Icon
                type="font-awesome-5"
                name={"exclamation-circle"}
                size={20}
                color={styles.errorText.color}
              />
              <Text style={styles.errorText}>
                {chatReqRoomsError
                  ? // If there's an error retrieving the user's rooms
                    "An error occured retrieving your chats."
                  : // If there's an error retrieving the user's messages
                    "An error occured retrieving one or more messages."}
              </Text>
            </View>
          )}
          <FlatList
            /**
             * Scroll indicator prevents glitch with scrollbar appearing
             * in the middle of the screen
             */
            scrollIndicatorInsets={{ right: 1 }}
            style={styles.room}
            data={rooms}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={false} // This is false as there's another indicator to show the data loading
                onRefresh={() => {
                  /**
                   * Fetching the messages is not necessary as useEffect
                   * will fetch the messages after the rooms are fetched
                   */
                  // Fetches data if data isn't loading already
                  if (!dataLoading) {
                    dispatch(fetchRooms);
                    shouldFetchMessages.current = true;
                  }
                }}
              />
            }
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <View>
                <Text style={styles.emptyList}>
                  No chats available. Start a new one!
                </Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    );
  else
    return (
      <LoadingScreen
        loadingText={rooms.length === 0 ? "Retrieving Chats" : "Updating Chats"}
      />
    );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFAFF" },
  mainContainer: { flex: 1, backgroundColor: "#FFFAFF" },
  room: {
    flex: 1,
  },
  errorContainer: {
    padding: 15,
    paddingHorizontal: "5%",
    backgroundColor: "#rgba(253,16,147,0.2)",
    flexDirection: "row",
    justifyContent: "center",
  },
  errorText: {
    marginLeft: 10,
    color: "#830149",
    fontSize: 15,
    fontWeight: "bold",
  },
  listItemContainer: {
    margin: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listItemHeaderTitleContainer: {
    flex: 1,
  },
  listItemHeaderTitle: {
    fontWeight: "bold",
    color: "#001f37",
  },
  listItemHeaderIcon: {
    marginLeft: 10,
  },
  listSubTitleDate: {
    fontWeight: "bold",
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 5,
    color: "#25455f",
  },
  emptyList: {
    fontSize: 18,
    textAlign: "center",
    paddingTop: deviceHeight / 10,
  },
});
