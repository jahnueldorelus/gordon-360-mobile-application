import messages from "./DummyData/dummy_messages";
import rooms from "./DummyData/dummy_rooms";
import AsyncStorage from "@react-native-community/async-storage";
import { get, put } from "../HTTP/index";
import moment from "moment";

/**
 * Returns a list of rooms associated with the main user
 */
export async function getRooms() {
  let roomIDList = get("dm/rooms");
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
          // Creates the user avatar
          user.avatar = user.user_avatar;
          delete user.user_avatar;
        });

        // Retrieves and saves all messages associated with the specified room
        await saveMessages(room[0]._id);

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
async function saveMessages(room_ID) {
  let messagesList = put("dm/messages", room_ID);
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
      // Gets the messages that were already in storage if there were any.
      // Otherwise, an empty list is returned
      let messages = (await AsyncStorage.getItem("messages"))
        ? JSON.parse(await AsyncStorage.getItem("messages"))
        : [];
      // Keeps track if the message object has been updated in the list of messages
      let updatedMessages = false;
      // Parses through the list of messages to find the correct message list to replace
      messages.forEach((room) => {
        if (room._id === room_ID) {
          room.messages = data;
          updatedMessages = true;
        }
      });
      // If the messages list with the specified room id is not in the list, then a
      // new message list object is added to the list
      if (!updatedMessages) {
        messages.push({ _id: room_ID, messages: data });
      }
      // Saves this new message array to storage
      AsyncStorage.setItem("messages", JSON.stringify(messages));
    }
  });
}

/**
 * Returns a list of messages associated with a specified room id
 * @param {number} room_ID The ID of a room
 */
export async function getMessages(room_ID) {
  let messages = JSON.parse(await AsyncStorage.getItem("messages"));
  return messages.filter((chat) => {
    return chat._id === room_ID;
  })[0];
}

/**
 * Returns the last message of a conversation from a specified room id
 * @param {number} room_ID The ID of a room
 */
export async function getLastMessageFromRoom(room_ID) {
  let textData = await getMessages(room_ID);
  if (textData) {
    // Parses through the text data to get the last message
    let lastMessage = ""; // Last text defaults to an empty string
    let texts = textData.messages;

    if (texts.length > 0) {
      texts = texts.sort((a, b) => {
        return moment(a.createdAt).isBefore(moment(b.createdAt));
      });
      if (texts[0].text.length > 0) lastMessage = texts[0].text;
    }
    return lastMessage;
  }
  return "";
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
    return room.users.filter((user) => user.user_id !== mainUser._id)[0].name;
  }
}

/**
 * Returns the number of users in a room.
 * @param {JSON} room The room to be parsed through
 */
export function getNumOfUsers(room) {
  return room.users.length;
}

/**
 * Returns the main user's info
 */
export async function getMainUser() {
  let user = JSON.parse(await AsyncStorage.getItem("user"));
  return user;
}

/**
 * Returns all the images in a room
 * @param {number} room_ID The ID of a room
 */
export async function getImages(room_ID) {
  let messageData = await getMessages(room_ID);
  let images = [];
  if (messageData)
    // Filters out all message objects that doesn't contain an image
    images = messageData.messages.filter(
      (message) => message.createdAt && message.image
    );
  return images;
}
