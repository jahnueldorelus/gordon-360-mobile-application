import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { FlatList } from "react-native";
import {
  getRooms,
  getLastMessageFromRoom,
} from "../../Services/Messages/MessageService";
import { ListItem, Avatar } from "react-native-elements";

const deviceHeight = Dimensions.get("window").height;

export const RoomsList = (props) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    let rooms = getRooms();
    setRooms(rooms);
  }, []);

  /**
   * Returns the name of the room. If the room name is not available,
   * the names of users in the room is returned
   * @param {JSON} room The room to be parsed through
   */
  function getRoomName(room) {
    // If the room is a group
    if (room.group) {
      // If the group has a name, then it's returned
      if (room.name) return room.name;
      // Since there's no group name, the names of the members are returned
      else {
        let names = "";
        room.users.forEach((user, index, arr) => {
          // Displays a user's name with a comma except for the last user
          if (index !== arr.length - 1) names += `${user.name}, `;
          else names += user.name;
        });
        return names;
      }
    }
    // Since the room is not a group, the name of the single user is returned
    else {
      return room.users[0].name;
    }
  }

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
              // Navigates to the chat screen with a specified room id
              props.navigation.navigate("Chat", {
                room_id: room.item._id,
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
                {getRoomName(room.item)}
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
