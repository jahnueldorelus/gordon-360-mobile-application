import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { FlatList } from "react-native";
import {
  getRooms,
  getLastMessageFromRoom,
  getRoomName,
  getMainUser,
} from "../../Services/Messages/MessageService";
import { ListItem, Avatar } from "react-native-elements";

const deviceHeight = Dimensions.get("window").height;

export const RoomsList = (props) => {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);

  /**
   * Gets the rooms of the main user
   */
  useEffect(() => {
    setRooms(getRooms());
  }, []);

  /**
   * Gets the main user
   */
  useEffect(() => {
    async function getUser() {
      await getMainUser().then((data) => {
        setUser(data);
      });
    }

    getUser();
  }, []);

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
                // Navigates to the chat screen with a specified room id
                props.navigation.navigate("Chat", {
                  roomProp,
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
                  {getLastMessageFromRoom(room.item._id)}
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
  else return <></>;
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
