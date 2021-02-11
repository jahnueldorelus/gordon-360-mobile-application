import AsyncStorage from "@react-native-community/async-storage";
import { get, put } from "../HTTP/index";
import moment from "moment";

/**
 * Returns a list of rooms associated with the main user
 * @param updateMessages Boolean that determines if the messages for each room
 *                        should be fetched and stored. Default is true
 */
export async function getRooms(state, updateMessages = true) {
  let roomIDList = get("dm/rooms", state);
  /**
   * Checks to make sure that the object returned is a list and is not
   * null or undefined
   */
  let result = roomIDList.then(async (roomData) => {
    // If there's data available, it's saved to storage and returned
    if (roomData) {
      // Formats the data to be used with our components
      let roomList = [];
      roomData.forEach(async (room) => {
        room[0].roomImage = "https://placeimg.com/140/140/any";
        // Creates the room id
        room[0]._id = room[0].room_id;
        delete room[0].room_id;
        // Creates each user object in the room
        room[0].users.forEach((user) => {
          // Creates the user id
          user._id = user.user_id;
          delete user.user_id;
          // Creates the user name
          user.name = user.user_name;
          delete user.user_name;
          // TEMPORARILY SETS AN IMAGE FOR EACH USER SINCE THE SERVER RETURNS NOTHING
          // user.avatar = user.user_avatar;
          user.avatar = "https://placeimg.com/140/140/any";
          delete user.user_avatar;
        });

        // Retrieves and saves all messages associated with the specified room
        if (updateMessages) await saveMessages(room[0]._id, state);

        // Creates the last message of the room
        room[0].lastMessage = await getLastMessageFromRoom(room[0]._id);
        roomList.push(room[0]);
      });

      // Saves this new room object to storage
      AsyncStorage.setItem("rooms", JSON.stringify(roomList));
      return roomList;
    } else {
      /**
       * If no data is present, then the fetch failed and data from
       * storage is returned if available
       */
      let roomData = JSON.parse(await AsyncStorage.getItem("rooms"));
      return roomData ? roomData : [];
    }
  });

  return result;
}

/**
 * Retrieves and save the list of messages associated with a specified room id
 * @param {number} room_ID The ID of a room
 */
async function saveMessages(room_ID, state) {
  let messagesList = put("dm/messages", room_ID, state);
  messagesList.then(async (data) => {
    // Checks to see if the data is an array. The data should be an array of messages
    if (Array.isArray(data)) {
      // Formats the data to be used with our components
      data.forEach((message) => {
        // Creates the message id
        message._id = message.message_id;
        delete message.message_id;
        // Creates the user object
        message.user._id = message.user.user_id;
        delete message.user.user_id;
        message.user.name = message.user.user_name;
        delete message.user.user_name;
        // TEMPORARILY SETS AN IMAGE FOR EACH USER SINCE THE SERVER RETURNS NOTHING
        // message.user.avatar = message.user.user_avatar;
        message.user.avatar = "https://placeimg.com/140/140/any";
        delete message.user.user_avatar;
        // TEMPORARILY SETS AN IMAGE FOR EACH MESSAGE
        message.image = "https://placeimg.com/140/140/any";
      });

      // Saves the messages to storage
      AsyncStorage.setItem(`room:${room_ID}`, JSON.stringify(data));
    }
  });
}

/**
 * Sends a message to be stored in the database
 * @param {Object} message The GiftedChat message object
 * @param {number} room_ID The ID of the room the message belongs to
 */
export async function sendMessage(message, room_ID) {
  let newMessageObject = {};
  newMessageObject.id = message._id;
  newMessageObject.room_id = room_ID;
  newMessageObject.text = message.text;
  newMessageObject.createdAt = moment(message.createdAt).format(
    "YYYY-MM-DDTHH:mm:ss.SSS"
  );
  newMessageObject.audio = null;
  newMessageObject.video = null;
  newMessageObject.system = false;
  newMessageObject.received = false;
  return put("dm/text", newMessageObject);
}

/**
 * Returns a list of messages associated with a specified room id
 * @param {number} room_ID The ID of a room
 */
export async function getMessages(room_ID) {
  return JSON.parse(await AsyncStorage.getItem(`room:${room_ID}`));
}

/**
 * Returns the last message of a conversation from a specified room id
 * @param {number} room_ID The ID of a room
 */
export async function getLastMessageFromRoom(room_ID) {
  let messages = await getMessages(room_ID);
  if (messages) {
    // Parses through the text data to get the last message
    let lastMessage = ""; // Last text defaults to an empty string

    if (messages.length > 0) {
      messages = messages.sort((a, b) => {
        return moment(a.createdAt).isBefore(moment(b.createdAt));
      });
      if (messages[0].text.length > 0) lastMessage = messages[0].text;
    }
    return lastMessage;
  }
  return "";
}

/**
 * Returns the main user's info
 */
export async function getMainUser(state) {
  let user = {};
  user.id = state.entities.profile.userInfo.data.ID;
  user.name =
    state.entities.profile.userInfo.data.FirstName +
    "." +
    state.entities.profile.userInfo.data.LastName;
  user.avatar = state.entities.profile.image.data;
  return user;
}

/**
 * Returns all the images in a room
 * @param {Array} messages The list of messages
 */
export const getRoomChatImages = (messages) => {
  let images = [];
  if (messages.length > 0)
    images = messages
      .slice()
      // Filters out all message objects that doesn't contain an image
      .filter((text) => text.createdAt && text.image)
      // Sorts the list of message objects by date of creation from newest to oldest
      .sort((a, b) => moment(a.createdAt) - moment(b.createdAt));
  return images;
};

/**
 * Returns the image of the room
 * @param {*} roomImage The image of the room
 */
export const getRoomImage = (roomImage) =>
  roomImage ? { uri: roomImage } : require("./Images/default-chat-image.png");

/**
 * Returns the image of the user
 * @param {*} userImage The image of the user
 */
export const getUserImage = (userImage) =>
  userImage ? { uri: userImage } : require("./Images/default-user-image.png");

/**
 * Gets the name of the room. If the room name is not available,
 * the names of users in the room is returned
 * @param {JSON} room The room to be parsed through
 * @param {JSON} userProfile The profile of the user
 * @return {String} The name of the room
 */
export const getRoomName = (room, userProfile) => {
  // The main user's ID
  const { ID: mainUserID } = userProfile;

  // If the room is a group
  if (room.group) {
    // If the group has a name, then it's returned
    if (room.name) return room.name;
    // Since there's no group name, the names of the members are returned
    else {
      let names = "";
      room.users.forEach((user, index, arr) => {
        // Checks to make sure that the main user's name is not shown
        if (user.id != mainUserID) {
          // Adds a comma to a user's name except for the last user
          if (index !== arr.length - 1) names += `${user.username}, `;
          else names += user.username;
        }
      });
      return names;
    }
  } else {
    /**
     * Since the room is not a group (2 users only), the name of the other user
     * (not the main user), is returned
     */
    return room.users.filter((user) => user.id !== mainUserID)[0].username;
  }
};

/**
 * (For the Chat Screen) Returns the name of the chat. If the chat name is not available,
 * then if the chat is a group, the number of participants (excluding the main user) is
 * returned. If the chat is not a group (only has 2 users), then the other user that's
 * not the main user is returned.
 * @param {JSON} room The room to be parsed through
 * @param {JSON} userProfile The profile of the user
 */
export function getChatName(room, userProfile) {
  // The main user's ID
  const { ID: mainUserID } = userProfile;

  // If the room is a group
  if (room.group) {
    // If the group has a name, then it's returned
    if (room.name) return room.name;
    // Since there's no group name, the number of people in the group is returned
    else {
      // One person is removed from the length of users because of those users is the main user
      return `${room.users.length - 1} People`;
    }
  } else {
    /**
     * Since the room is not a group (2 users only), the name of the other user
     * (not the main user), is returned
     */
    return room.users.filter((user) => user.id !== mainUserID)[0].username;
  }
}
