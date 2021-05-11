import moment from "moment";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";

// The directory where all images are stored
const imageDir = FileSystem.documentDirectory + "Images/";

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
 * Gets the image of the room.
 * This is specifically for setting the source of an React Native
 * Image component.
 * @param {object} room The object of the room
 * @param {string} mainUserID The ID of the main user
 */
export const getRoomImage = (room, mainUserID) => {
  // Checks that the room exists
  if (room.id) {
    // If there's no room image and the chat is a group
    if (room.group) {
      return require("./Images/default-group-image.png");
    }
    // If there's no room image and the chat is not a group
    else if (!room.group) {
      // Gets the other user in the group
      const otherUser = room.users.filter((user) => user.id !== mainUserID)[0];
      // If the other user has an image, their image is returned. Otherwise it's the default user image
      return otherUser.image
        ? {
            uri: "data:image/gif;base64," + getImage(otherUser.image),
          }
        : require("./Images/default-non-group-image.png");
    }
  }
  return null;
};

/**
 * Gets the name of the room. If the room name is not available,
 * the names of users in the room is returned
 * @param {JSON} room The room to be parsed through
 * @param {number} mainUserID The ID of the main user
 * @return {string} The name of the room
 */
export const getRoomName = (room, mainUserID) => {
  // All users in the room apart from the main user
  const otherUsers = room.users.filter((user) => user.id !== mainUserID);

  // If the room is a group
  if (room.group) {
    // If the group has a name, then it's returned
    if (room.name) return room.name;
    // Since there's no group name, the names of the members are returned
    else {
      let names = "";
      // If there are 2 people in the room (not including the main user)
      if (otherUsers.length === 2) {
        names = `${otherUsers[0].username} and ${otherUsers[1].username}`;
      } else {
        // If there's more than 2 people in the room (not including the main user)
        otherUsers.forEach((user, index, arr) => {
          // Adds a comma to a user's name except for the last user
          if (index !== arr.length - 1) names += `${user.username}, `;
          else names += `and ${user.username}`;
        });
      }
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

/**
 * Gets a readable format of a date
 * @param {dateFormat} date The date object
 * @returns {String} A readable date
 */
export const getReadableDateFormat = (date) => {
  const readableDate = moment(date);
  // Checks to see if the date is the same as the current day
  if (readableDate.isSame(new Date(), "day")) {
    return `Today - ${readableDate.format("h:mm a")}`;
  }
  // Checks to see if the date is within the same week
  else if (readableDate.isSame(new Date(), "week")) {
    // If the date was the day before the current day (aka yesterday)
    if (readableDate.isSame(moment().subtract(1, "days").startOf("day"), "d")) {
      return `Yesterday - ${readableDate.format("h:mm a")}`;
    }
    // If the date is within the same week as the current day
    else {
      return readableDate.format("dddd - h:mm a");
    }
  } else {
    return readableDate.format("MM/DD/YY - h:mm a");
  }
};

/**
 * Gets the user's image in a room.
 * This is specifically for getting the user's image property.
 * @param {string} userID The user's ID
 * @param {object} room The room object
 */
export const getUserImageFromRoom = (userID, room) => {
  // Checks to see if the room is stringified before parsing it
  try {
    room = JSON.parse(room);
  } catch (err) {} // If error occurs, then the object is not stringified

  // The user object to retrieve from the room
  const user = room.users.filter((user) => user.id === userID)[0];

  // If the user is not null, their image is returned
  return JSON.stringify(user) !== JSON.stringify([]) ? user.image : "";
};

/**
 * Creates a message ID similar to the format
 * of GiftedChat
 */
export const getNewMessageID = () => {
  return (
    Math.random().toString(36).substr(2, 8) +
    "-" +
    Math.random().toString(36).substr(2, 4) +
    "-" +
    Math.random().toString(36).substr(2, 4) +
    "-" +
    Math.random().toString(36).substr(2, 4) +
    "-" +
    Math.random().toString(36).substr(2, 12)
  );
};

/**
 * Removes any notifications in the notification tray associated with the room
 * @param {number} roomID The ID of the room
 */
export const removeNotificationsInTray = async (roomID) => {
  const notificationTray = await Notifications.getPresentedNotificationsAsync();

  notificationTray.forEach(async (notification, index) => {
    if (
      notification.request.content.data.roomID &&
      parseInt(notification.request.content.data.roomID) === roomID
    ) {
      // Removes the notification from the notifications tray
      await Notifications.dismissNotificationAsync(
        notification.request.identifier
      );
    }
  });
};

/**
 * Converts base64 into an array of the base64 content
 * @param {string} image An image in base64 format
 * @param {number} roomID The ID of the room the image belongs to
 * @param {string} messageID The ID of the messsage the image belongs too
 * @returns {string} The ID of the image
 */
export const saveImageAndGetID = (image, roomID, messageID) => {
  if (image) {
    // The image's ID
    const imageID =
      roomID && messageID
        ? `message-${messageID}-image.b64`
        : `room-${roomID}-image.b64`;
    // Saves the image to the device
    saveImage(image, imageID);
    // Returns the image's ID
    return imageID;
  }
  return null;
};

/**
 * Gets an image from the device
 * @param {string} imageID The ID of the image
 * @return {Promise} A promise containing the base64 format of the image
 */
export const getImage = (imageID) => {
  if (imageID) {
    let image = null;
    /**
     * Reads the file of given image ID
     * @param {string} imageID  The ID of the image
     */
    const readImage = async (imageID) => {
      image = await FileSystem.readAsStringAsync(imageDir + imageID);
      return image;
    };

    return readImage(imageID);
  } else return null;
};

/**
 * Saves an image to the device
 * @param {string} image An image in base64 format
 * @param {string} imageID The ID of the image
 */
const saveImage = async (image, imageID) => {
  // Checks to see if the image folder exists. If it doesn't, it's created
  const dirInfo = await FileSystem.getInfoAsync(imageDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true });
  }

  // Writes the base64 image to a file if it's not already there
  if (!(await FileSystem.getInfoAsync(imageDir + imageID).exists))
    await FileSystem.writeAsStringAsync(imageDir + imageID, image);
};
