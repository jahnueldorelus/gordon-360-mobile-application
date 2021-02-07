import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiRequested } from "../middleware/api";
import moment from "moment";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "chat",
  initialState: {
    rooms: {},
    sortRoomList: [],
    messages: {},
    messageSort: {},
    dataLoading: false,
    fetchRoomsError: false,
  },
  reducers: {
    /**
     * ROOM REDUCERS
     */
    // Adds the list of rooms
    userRoomsAdded: (state, action) => {
      // New sort list
      let newSortList = [];
      // Goes through the list of rooms and modifies its properties
      action.payload.forEach((obj) => {
        const room = obj[0];
        // Adds room data to the sort list
        newSortList.push({
          id: room.room_id,
          lastUpdated: room.lastUpdated,
        });
        // Adds the room to the rooms object
        state.rooms[room.room_id] = {
          image: room.roomImage,
          id: room.room_id,
          name: room.name,
          group: room.group,
          createdAt: room.createdAt,
          lastUpdated: room.lastUpdated,
          users: room.users.map((user) => {
            return {
              id: user.user_id,
              username: user.user_name,
              image: user.user_avatar,
            };
          }),
        };
      });

      // Sorts the list in order by the last updated date
      state.sortRoomList = newSortList.sort(
        (a, b) => moment(a.lastUpdated) - moment(b.lastUpdated)
      );
    },

    // User's rooms list request failed
    roomsReqFailed: (state, action) => {
      state.fetchRoomsError = JSON.stringify(action.payload);
    },

    /**
     * MESSAGE REDUCERS
     */
    // Adds the list of messages for a room
    userMessagesAdded: (state, action) => {
      // The room ID where all messages will be placed
      let roomID = action.config.data;
      // Temporary object that will contain all message objects
      let messages = {};
      // Creates a list for sorting the users messages based on room ID
      state.messageSort[roomID] = [];

      // Adds each text to the messages object
      action.payload
        // Sorted from newest to oldest date
        .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
        .forEach((text) => {
          // Adds the message object to the object of messages
          messages[text.message_id] = {
            ...text,
            image: "https://placeimg.com/140/140/any",
            _id: text.message_id,
            user: {
              _id: text.user.user_id,
              name: text.user.user_name,
              avatar: "https://placeimg.com/140/140/any",
            },
          };
          // Adds the message's ID and date to a list for sorting
          state.messageSort[roomID].push({
            _id: text.message_id,
            createdAt: text.createdAt,
          });
        });

      // Creates a new object with the room id as the key
      state.messages[roomID] = messages;

      /**
       * Adds the last message and last updated to the room's object data
       */
      // The ID of the last message in the room
      const lastMessageID = state.messageSort[roomID][0]._id;
      // The last message's data object
      const lastMessageObj = state.messages[roomID][lastMessageID];

      // Temporary = In future, back-end should correctly set these properties

      // (Temporary) Updates the room's lastMessage property
      state.rooms[roomID].lastMessage = lastMessageObj.text;
      // (Temporary) Updates the room's lastUpdated property
      state.rooms[roomID].lastUpdated = lastMessageObj.createdAt;
    },

    // User's messages list request started
    messagesReqStarted: (state, action) => {
      state.messagesLoading = true;
    },

    // Adds a message to the user's messsages based on room id
    addMessage: (state, action) => {
      const { roomID, messageObj } = action.payload;
      const roomMessages = state.messages[roomID];
      const roomMessagesSorted = state.messageSort[roomID];
      // Adds the message to the room's object of messages
      roomMessages[messageObj.id] = messageObj;
      // Adds the message to the room's sorted message list (at the beginning)
      roomMessagesSorted.splice(0, 0, {
        _id: messageObj.id,
        createdAt: messageObj.createdAt,
      });
    },

    // Updates the pending status of a message
    updateMessagePending: (state, action) => {
      const serverSuccess = action.payload;
      // If the server successfully received the message
      if (serverSuccess) {
        const { roomID, messageObj } = action.passedData;
        const message = state.messages[roomID][messageObj.id];
        const room = state.rooms[roomID];
        // Changes the message's pending status to false
        message.pending = false;
        // Updates the room's lastUpdated and lastMessage properties
        room.lastMessage = messageObj.text;
        room.lastUpdated = messageObj.createdAt;
      }
    },

    /**
     * FETCHING STATUS REDUCERS
     */
    // Loading the user's rooms and/or messages started
    dataLoadingStarted: (state, action) => {
      state.dataLoading = true;
    },

    // Loading the user's rooms and/or messages ended
    dataLoadingEnded: (state, action) => {
      state.dataLoading = false;
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/*********************************** SELECTORS ***********************************/
/**
 * Returns the user's rooms
 */
const getRooms = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.rooms
);

/**
 * Returns the user's rooms's sort list
 */
const getRoomsSortList = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.sortRoomList
);

/**
 * Returns the user's rooms in order of the sorted list
 */
export const getUserRooms = createSelector(
  getRooms,
  getRoomsSortList,
  (rooms, sortList) => sortList.map((room) => rooms[room.id])
);

/**
 * Returns the user's object of messages
 */
export const getUserMessages = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.messages
);

/**
 * Returns a user's room based upon room ID
 * @param {String} id The id of the room
 */
export const getUserRoomByID = (id) =>
  createSelector(
    (state) => state.entities.chat,
    (chat) => chat.rooms[id]
  );

/**
 * Returns the user's messages (as a list) based upon room ID
 * @param {String} id The id of the room
 */
export const getUserMessagesByID = (id) =>
  createSelector(
    (state) => state.entities.chat,
    (chat) => getListMessagesByID(chat, id)
  );

/**
 * Returns the loading status of fetching the user's
 * list of rooms and messages
 */
export const getUserChatLoading = createSelector(
  (state) => state.entities.chat,
  (chat) => Boolean(chat.dataLoading)
);

/*********************************** ACTION CREATORS ***********************************/
/**
 * Fetches the user's list of rooms
 * @returns An action of fetching the user's list of rooms
 */
export const fetchRooms = () => (dispatch, getState) => {
  dispatch(
    apiRequested({
      url: "/dm/rooms",
      useEndpoint: true,
      onSuccess: slice.actions.userRoomsAdded.type,
      onError: slice.actions.roomsReqFailed.type,
      onStart: slice.actions.dataLoadingStarted.type,
    })
  );
};

/**
 * Fetches the user's messages
 * @returns An action of fetching the user's messages
 */
export const fetchMessages = () => (dispatch, getState) => {
  // List of rooms ids to fetch each room's messages
  const roomIDs = getState().entities.chat.sortRoomList;

  roomIDs.forEach((room) => {
    dispatch(
      apiRequested({
        url: "/dm/messages",
        method: "put",
        data: room.id,
        useEndpoint: true,
        onSuccess: slice.actions.userMessagesAdded.type,
        onEnd: slice.actions.dataLoadingEnded.type,
      })
    );
  });
};

/**
 * Sends the user message
 * @param {Object} message The message object to send
 * @returns An action of sending the user's message
 */
export const sendMessage = (message) => (dispatch, getState) => {
  // User selected room id
  const roomID = getState().ui.chat.selectedRoomID;
  // Reformats the message object for the back-end to parse correctly
  const newMessage = {
    id: message._id,
    _id: message._id,
    room_id: roomID,
    text: message.text,
    user: message.user,
    createdAt: moment(message.createdAt).format("YYYY-MM-DDTHH:mm:ss.SSS"),
    image: message.image ? message.image : null,
    audio: message.audio ? message.audio : null,
    video: message.video ? message.video : null,
    system: message.system ? message.system : false,
    received: message.received ? message.received : false,
    pending: true,
  };

  // Adds the message to the state
  dispatch(slice.actions.addMessage({ roomID, messageObj: newMessage }));

  // Sends the message to the back-end
  dispatch(
    apiRequested({
      url: "/dm/text",
      method: "put",
      data: newMessage,
      useEndpoint: true,
      onSuccess: slice.actions.updateMessagePending.type,
      passedData: { roomID, messageObj: newMessage },
    })
  );
};

/*********************************** HELPER FUNCTIONS ***********************************/
/**
 * Retrieves the list of messages based upon room ID
 * @param {Object} chat The state of this reducer
 * @param {number} id The id of the room to retrieve messages from
 * @returns {Array} A list of the messages based upon the room ID
 */
const getListMessagesByID = (chat, id) => {
  /**
   * Gets the list of messages for a room that's sorted in order from
   * newest to oldest date
   */
  let messages = chat.messageSort[id];
  /**
   * Returns a mapping of each text to retrieve the full message object
   * Conversion: { _id, createdAt } -> { _id, text, user_id, user, image, etc. }
   */
  return messages.map((text) => chat.messages[id][text._id]);
};
