import messages from "./DummyData/dummy_messages";
import rooms from "./DummyData/dummy_rooms";

/**
 * Returns a list of rooms associated with the main user
 */
export function getRooms() {
  return rooms;
}

/**
 * Returns a list of messages associated with a specified room id
 * @param {number} room_ID
 */
export function getMessages(room_ID) {
  return messages.filter((chat) => {
    return chat.room_id === room_ID;
  });
}

/**
 * Returns the last message of a conversation from a specified room id
 * @param {number} room_ID
 */
export function getLastMessageFromRoom(room_ID) {
  let texts = getMessages(room_ID);
  if (texts.length > 0) {
    texts = texts[0].messages;
    texts = texts.sort((a, b) => a.createdAt < b.createdAt);
    return texts[0].text;
  }
  return null;
}

/**
 * (For the Room Screen) Returns the name of the room. If the room name is not available,
 * the names of users in the room is returned
 * @param {JSON} room The room to be parsed through
 * @param {JSON} mainUser The main user
 */
export function getRoomName(room, mainUser) {
  // If the room is a group
  if (room.group) {
    // If the group has a name, then it's returned
    if (room.name) return room.name;
    // Since there's no group name, the names of the members are returned
    else {
      let names = "";
      room.users.forEach((user, index, arr) => {
        // Checks to make sure that the main user's name is not shown
        if (user._id != mainUser._id) {
          // Adds a comma to a user's name except for the last user
          if (index !== arr.length - 1) names += `${user.name}, `;
          else names += user.name;
        }
      });
      return names;
    }
  } else {
    /**
     * Since the room is not a group (2 users only), the name of the other user
     * (not the main user), is returned
     */
    return room.users.filter((user) => user._id !== mainUser._id)[0].name;
  }
}

/**
 * (For the Chat Screen) Returns the name of the chat. If the chat name is not available,
 * then if the chat is a group, the number of participants (excluding the main user) is
 * returned. If the chat is not a group (only has 2 users), then the other user that's
 * not the main user is returned.
 * @param {JSON} room The room to be parsed through
 * @param {JSON} mainUser The main user
 */
export function getChatName(room, mainUser) {
  // If the room is a group
  if (room.group) {
    // If the group has a name, then it's returned
    if (room.name) return room.name;
    // Since there's no group name, the number of people in the group is returned
    else {
      // One person is removed from the length of users because of those users is the main user
      return `${getNumOfUsers(room) - 1} People`;
    }
  } else {
    /**
     * Since the room is not a group (2 users only), the name of the other user
     * (not the main user), is returned
     */
    return room.users.filter((user) => user._id !== mainUser._id)[0].name;
  }
}

/**
 * Returns the number of users in a room.
 * @param {JSON} room The room to be parsed through
 */
export function getNumOfUsers(room) {
  return room.users.length;
}