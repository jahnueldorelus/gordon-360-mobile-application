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
