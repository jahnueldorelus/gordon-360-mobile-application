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
import { getReadableDateFormat } from "../../Services/Messages/index";
import { ListItem, Icon } from "react-native-elements";
import { CustomLoader } from "../../Components/CustomLoader";
import {
  getUserRooms,
  fetchRooms,
  fetchMessages,
  getUserMessages,
  getUserChatLoading,
  getUserRoomsWithNewMessages,
} from "../../store/entities/chat";
import { getUserInfo } from "../../store/entities/profile";
import { getToken } from "../../store/entities/Auth/authSelectors";
import { useDispatch, useSelector } from "react-redux";
import { setRoomID } from "../../store/ui/chat";

const deviceHeight = Dimensions.get("window").height;

export const RoomsList = (props) => {
  // Redux Dispath
  const dispatch = useDispatch();

  // The user's token
  const token = useSelector(getToken);
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

  // Gets the rooms of the main user and the main user's information
  useEffect(() => {
    // If the user's token is available
    if (token) {
      // If user's rooms is available
      if (JSON.stringify(rooms) !== JSON.stringify({})) {
        /**
         * If the user's messages are unavailable or the user's room
         * and messages are being refreshed, the user's messages are fetched
         */
        if (JSON.stringify(messages) === JSON.stringify({}) || dataLoading)
          dispatch(fetchMessages());
      } else {
        // If the user's rooms are not available, they are fetched
        dispatch(fetchRooms());
      }
    } else {
      // Navigates to the Login screen since authentication failed
      props.navigation.navigate("Login");
    }
  }, [token, rooms]);

  if (rooms && roomsWithNewMessages && userProfile)
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
                /**
                 * Navigates to the chat screen and saves the room ID
                 * so that navigation can have the ID of the last room the user entered
                 */
                props.navigation.navigate("Chat", { roomID: room.item.id });
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
