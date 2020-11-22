import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  LogBox,
} from "react-native";
import {
  getRooms,
  getRoomName,
  getMainUser,
} from "../../Services/Messages/MessageService";
import { ListItem, Avatar } from "react-native-elements";
import { CustomLoader } from "../../Components/CustomLoader";

const deviceHeight = Dimensions.get("window").height;

export const RoomsList = (props) => {
  const [rooms, setRooms] = useState(null);
  const [user, setUser] = useState(null);

  // Gets the rooms of the main user and the main user's information
  useEffect(() => {
    getAllRooms();
    getUser();
  }, []);

  /**
   * Gets the rooms of the main user
   */
  async function getAllRooms() {
    setRooms(await getRooms());
  }

  /**
   * Gets the main user
   */
  async function getUser() {
    await getMainUser().then((data) => {
      setUser(data);
    });
  }

  if (rooms && user)
    return (
      <FlatList
        style={styles.room}
        data={rooms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(room, index) => {
          return (
            <ListItem
              bottomDivider
              key={index}
              onPress={() => {
                // Creates a copy of the room object
                let roomProp = { ...room.item };
                // Since Date object are non-serializable, they are converted to JSON
                // before passed as a parameter to navigation
                roomProp.createdAt = new Date(room.item.createdAt).toJSON();
                roomProp.lastUpdated = new Date(room.item.lastUpdated).toJSON();
                // This prevents a warning about passing in a function as a parameter in the navigation
                // It's fine for us to do this according to this documentation
                // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
                LogBox.ignoreLogs([
                  "Non-serializable values were found in the navigation state",
                ]);
                // Navigates to the chat screen with a specified room id
                props.navigation.navigate("Chat", {
                  roomProp,
                  updateRooms: getAllRooms,
                });
              }}
            >
              <Avatar
                rounded
                size="medium"
                title={room.item.name ? room.item.name : "temp"}
                source={room.item.roomImage && { uri: room.item.roomImage }}
              />
              <ListItem.Content>
                <ListItem.Title numberOfLines={1} style={styles.listItemTitle}>
                  {getRoomName(room.item, user)}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={2}>
                  {room.item.lastMessage}
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
    backgroundColor: "white",
  },
  listItemTitle: { fontWeight: "bold" },
  emptyList: {
    fontSize: 18,
    textAlign: "center",
    paddingTop: deviceHeight / 10,
  },
});
