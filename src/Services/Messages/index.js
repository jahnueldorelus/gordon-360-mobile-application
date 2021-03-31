import moment from "moment";

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
 * @param {number} mainUserID The ID of the main user
 * @return {string} The name of the room
 */
export const getRoomName = (room, mainUserID) => {
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
 * @param {string} mainUserID The ID of the main user
 * @returns {string} The name of the chat
 */
export function getChatName(room, mainUserID) {
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
