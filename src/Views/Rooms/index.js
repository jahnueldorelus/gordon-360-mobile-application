import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { getRoomName, getRoomImage } from "../../Services/Messages";
import { getReadableDateFormat } from "../../Services/Messages/index";
import { ListItem, Icon } from "react-native-elements";
import {
  getUserRooms,
  fetchRooms,
  fetchMessages,
  getUserMessages,
  getUserChatLoading,
  getUserRoomsWithNewMessages,
  getChatRequestRoomsError,
  getChatRequestMessagesError,
} from "../../store/entities/chat";
import { getUserInfo } from "../../store/entities/profile";
import { useDispatch, useSelector } from "react-redux";
import { setRoomID } from "../../store/ui/chat";
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
   * This helps prevent multiple fetches for the user's messages froom being made
   */
  const shouldFetchMessages = useRef(true);

  // Re-fetches the user's messages if the rooms object is available
  useEffect(() => {
    // If user's rooms is available
    if (JSON.stringify(rooms) !== JSON.stringify({})) {
      /**
       * If the user's messages are unavailable or the user's room
       * and messages are being refreshed, and the fetching is allowed,
       *  the user's messages are fetched
       */
      if (
        JSON.stringify(messages) === JSON.stringify({}) ||
        (dataLoading && shouldFetchMessages.current)
      ) {
        dispatch(fetchMessages());
        shouldFetchMessages.current = false;
      }
    }
  }, [rooms]);

  // Fetches the user's room on first launch of this component
  useEffect(() => {
    dispatch(fetchRooms);
  }, []);

  if (rooms && roomsWithNewMessages && userProfile && !dataLoading)
    return (
      <View style={styles.mainContainer}>
        {(chatReqRoomsError || chatReqMessagesError) && (
          <View style={styles.errorContainer}>
            <Icon
              type="font-awesome-5"
              name="exclamation-circle"
              size={20}
              color={styles.errorText.color}
            />
            <Text style={styles.errorText}>
              {chatReqRoomsError
                ? `An error occured retrieving your chats.`
                : `An error occured retrieving one or more messages.`}
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
              refreshing={dataLoading}
              onRefresh={() => {
                /**
                 * Fetching the messages is not necessary as useEffect
                 * will fetch the messages after the rooms are fetched
                 */
                dispatch(fetchRooms);
                shouldFetchMessages.current = true;
              }}
            />
          }
          renderItem={(room) => {
            return (
              <ListItem
                containerStyle={{
                  ...styles.listItemContainer,
                  // Adds a bottom margin to the last item in the list
                  marginBottom: room.index === rooms.length - 1 ? 15 : 0,
                }}
                key={room.index}
                underlayColor="none"
                onPress={() => {
                  // Sets the user's selected room ID
                  dispatch(setRoomID(room.item.id));
                  // Navigates to the chat screen
                  navigation.navigate(ScreenNames.chat);
                }}
              >
                <Image
                  source={getRoomImage(room.item, userProfile.ID)}
                  style={styles.listItemImage}
                />
                <ListItem.Content>
                  <View style={styles.listItemHeader}>
                    <View style={styles.listItemHeaderTitleContainer}>
                      <ListItem.Title
                        numberOfLines={1}
                        style={styles.listItemHeaderTitle}
                      >
                        {getRoomName(room.item, userProfile.ID)}
                      </ListItem.Title>
                    </View>
                    {/* Displays a blue badge if the room has any unopened messages */}
                    {roomsWithNewMessages.includes(room.item.id) && (
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
                    {room.item.lastMessage}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle
                    numberOfLines={1}
                    style={styles.listSubTitleDate}
                  >
                    {getReadableDateFormat(room.item.lastUpdated)}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            );
          }}
          ListEmptyComponent={() => (
            <View>
              <Text style={styles.emptyList}>
                No Chats Available. Start a new one!
              </Text>
            </View>
          )}
        />
      </View>
    );
  else return <LoadingScreen loadingText="Retrieving Chats" />;
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFAFF" },
  room: {
    flex: 1,
  },
  errorContainer: {
    padding: 15,
    paddingHorizontal: "5%",
    backgroundColor: "#rgba(253,16,147,0.2)",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: { marginLeft: 10, color: "#830149", fontSize: 15 },
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
  listItemImage: {
    borderColor: "#014983",
    width: 50,
    height: 50,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
