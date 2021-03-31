import React, { useEffect } from "react";
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
import { ListItem } from "react-native-elements";
import { CustomLoader } from "../../Components/CustomLoader";
import {
  getUserRooms,
  fetchRooms,
  fetchMessages,
  getUserMessages,
  getUserChatLoading,
} from "../../store/entities/chat";
import { getUserInfo } from "../../store/entities/profile";
import { getToken } from "../../store/entities/auth";
import { useDispatch, useSelector, useStore } from "react-redux";
import moment from "moment";
import { setRoomID } from "../../store/ui/chat";
import { startWebConnection } from "../../../src/Services/WebSocket";
import { useNavigation, useRoute } from "@react-navigation/native";

const deviceHeight = Dimensions.get("window").height;

export const RoomsList = (props) => {
  // Redux Dispath
  const dispatch = useDispatch();
  // Redux Store
  const store = useStore();

  // App Navigation and Route
  const navigation = useNavigation();
  const route = useRoute();

  // The user's token
  const token = useSelector(getToken);
  // The user's list of rooms
  const rooms = useSelector(getUserRooms);
  // The user's messages
  const messages = useSelector(getUserMessages);
  // The user's profile info
  const userProfile = useSelector(getUserInfo);
  // The user's chat loading status
  const dataLoading = useSelector(getUserChatLoading);

  /**
   * Connects to the server through the WebSocket
   * If the user made it to this screen, then that means they have loogged in and
   * that their user profile information is available. If the user info is not
   * available, a websocket connection isn't established.
   */
  useEffect(() => {
    if (userProfile)
      // Makes a live connection to the back-end with a web socket
      startWebConnection(store, navigation, route);
  }, []);

  // Gets the rooms of the main user and the main user's information
  useEffect(() => {
    // If the user's token is available
    if (token) {
      // If user's rooms is available
      if (!jQuery.isEmptyObject(rooms)) {
        /**
         * If the user's messages are unavailable or the user's
         * room and messages are being refreshed
         */
        if (jQuery.isEmptyObject(messages) || dataLoading)
          dispatch(fetchMessages());
      } else {
        // If the user's rooms are not available, they are fetched
        dispatch(fetchRooms());
      }
    } else {
      // Navigates to the Messages screen since authentication passed
      props.navigation.navigate("Login");
    }
  }, [token, rooms]);

  /**
   * Gets the date of the room
   * @param {Object} room
   * @returns {String} The date of the room
   */
  const getRoomDate = (date) => {
    const roomDate = moment(date);
    // Checks to see if the date is the same as the current day
    if (roomDate.isSame(new Date(), "day")) {
      return `Today - ${roomDate.format("h:mm a")}`;
      // return roomDate.format("MMMM Do YYYY, h:mm:ss a")
    }
    // Checks to see if the date is within the same week
    else if (roomDate.isSame(new Date(), "week")) {
      // If the date was the day before the current day (aka yesterday)
      if (roomDate.isSame(moment().subtract(1, "days").startOf("day"), "d")) {
        return `Yesterday - ${roomDate.format("h:mm a")}`;
      }
      // If the date is within the same week as the current day
      else {
        return roomDate.format("dddd - h:mm a");
      }
    } else {
      return roomDate.format("MM/DD/YY - h:mm a");
    }
  };

  if (rooms && userProfile)
    return (
      <FlatList
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
              dispatch(fetchRooms());
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
                // Saves the
                route.params = { roomID: room.item.id };
                // Navigates to the chat screen
                props.navigation.navigate("Chat");
              }}
            >
              <Image
                source={getRoomImage(room.item.image)}
                style={styles.listItemImage}
              />
              <ListItem.Content>
                <ListItem.Title numberOfLines={1} style={styles.listItemTitle}>
                  {getRoomName(room.item, userProfile.ID)}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={2}>
                  {room.item.lastMessage}
                </ListItem.Subtitle>
                <ListItem.Subtitle
                  numberOfLines={1}
                  style={styles.listSubTitleDate}
                >
                  {getRoomDate(room.item.lastUpdated)}
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
    );
  else return <CustomLoader />;
};

const styles = StyleSheet.create({
  room: {
    flex: 1,
    backgroundColor: "#FFFAFF",
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
  listItemTitle: { fontWeight: "bold", color: "#001f37" },
  listItemImage: {
    borderColor: "#014983",
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
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
