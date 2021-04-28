import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiRequested } from "../middleware/api";
import { getSelectedRoomID } from "../ui/chat";
import moment from "moment";
import {
  getRoomName,
  getUserImageFromRoom,
} from "../../Services/Messages/index";
import * as Notifications from "expo-notifications";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "chat",
  initialState: {
    rooms: {},
    sortRoomList: [],
    roomsWithNewMessages: [],
    newRoomCreated: {
      roomCreated: false,
      roomID: null,
      roomLastUpdated: null,
    },
    createRoomLoading: false,
    notificationIdentifiers: [],
    messages: {},
    messageSort: {},
    fetchMessagesErrors: {},
    dataLoading: false,
    fetchRoomsError: false,
  },
  reducers: {
    /**
     * ROOM REDUCERS
     */
    addRoom: (state, action) => {
      // Creates a copy of the rooms sort list
      let newSortRoomList = state.sortRoomList.slice();

      /**
       * Formats the room object to be parsed correctly
       */
      let newRoom = correctedRoomObject(action.payload);

      // Corrects the room ID property
      newRoom.id = action.payload.id;
      // Corrects the room image property
      newRoom.image = action.payload.image;

      /**
       * Checks to make sure there's not a duplicate room. If there is,
       * the newer room object is not saved
       */
      if (
        newSortRoomList.filter((prevRoom) => prevRoom.id === newRoom.id)
          .length === 0
      ) {
        newSortRoomList.push({
          id: newRoom.id,
          lastUpdated: newRoom.lastUpdated,
        });

        // Sorts the room list to be listed in the correct order by date
        state.sortRoomList = newSortRoomList.sort(
          (a, b) => moment(b.lastUpdated) - moment(a.lastUpdated)
        );

        // Adds the room to the rooms object
        state.rooms[newRoom.id] = newRoom;
        // Shows in the state that a new room was created and sets it's ID
        state.newRoomCreated = {
          roomCreated: true,
          roomID: newRoom.id,
          roomLastUpdated: newRoom.lastUpdated,
        };
        // Resets the room creating loading
        state.createRoomLoading = false;
      }
    },

    newRoomReqFailed: (state, action) => {
      // Since there's no new room, default values are set
      state.newRoomCreated.roomCreated = false;
      state.newRoomCreated.roomID = null;
      // Resets the room creating loading
      state.createRoomLoading = false;
    },

    setCreateRoomLoading: (state, action) => {
      state.createRoomLoading = true;
    },

    // Sets the new room created back to false
    resetNewRoomCreated: (state, action) => {
      state.newRoomCreated = false;
    },

    // Adds the list of rooms
    userRoomsAdded: (state, action) => {
      // New sort list
      let newSortList = [];
      // Goes through the list of rooms and modifies its properties
      action.payload.forEach((obj) => {
        const room = obj[0];
        // Checks to make sure the room object is existent
        if (room) {
          // Adds room data to the sort list
          newSortList.push({
            id: room.room_id,
            lastUpdated: room.lastUpdated,
          });
          // Adds the room to the rooms object
          state.rooms[room.room_id] = {
            ...correctedRoomObject(room),
          };
        }
      });

      // Sorts the list in order by the last updated date
      state.sortRoomList = newSortList.sort(
        (a, b) => moment(b.lastUpdated) - moment(a.lastUpdated)
      );
    },

    // User's rooms list request failed
    roomsReqFailed: (state, action) => {
      state.fetchRoomsError = JSON.stringify(action.payload);
    },

    // Saves the room ID where a new notification was received
    addRoomIDToNewMessage: (state, action) => {
      // Checks if the list of rooms with new messages contains the given room ID
      if (!state.roomsWithNewMessages.includes(action.passedData.roomID)) {
        state.roomsWithNewMessages = [
          ...state.roomsWithNewMessages,
          action.passedData.roomID,
        ];
      }
    },

    // Removes the room ID from the list of rooms with new messages
    removeRoomIDFromNewMessages: (state, action) => {
      // Check if the list of rooms with new messages contains the given room ID
      if (state.roomsWithNewMessages.includes(action.payload.roomID)) {
        state.roomsWithNewMessages = state.roomsWithNewMessages.filter(
          (id) => id !== action.payload.roomID
        );

        // A copy of the notification tray list
        let notifcationTrayTemp = [...action.payload.notificationTray];

        /**
         * Removes any notifications in the notification tray associated with the room
         * and removes the notification's ID from the list of notification IDs
         */
        action.payload.notificationTray.forEach((notification, index) => {
          if (
            notification.request.content.data.roomID &&
            parseInt(notification.request.content.data.roomID) ===
              action.payload.roomID
          ) {
            // Removes the notification from the copy of the notification tray
            notifcationTrayTemp.splice(index, 1);
            // Removes the notification from the notifications tray
            Notifications.dismissNotificationAsync(
              notification.request.identifier
            );
            // Removes the notification's ID from the list of notification IDs
            state.notificationIdentifiers = state.notificationIdentifiers.filter(
              (identifier) => identifier !== notification.request.identifier
            );
          }
        });

        /**
         * If there are no more notifications in the notification tray,
         * the app's badge number is set to 0
         */
        if (notifcationTrayTemp.length === 0)
          Notifications.setBadgeCountAsync(0);
      }
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
      // Deletes the error saved in the state if a fetch error for the room exists
      if (state.fetchMessagesErrors[roomID])
        delete state.fetchMessagesErrors[roomID];

      // Adds each message to the messages object
      action.payload
        // Sorted from newest to oldest date
        .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
        .forEach((message) => {
          // Adds the message object to the object of messages
          messages[message.message_id] = {
            ...message,
            // Modifies the message ID property
            _id: message.message_id,
            user: {
              /**
               * Modifies the avatar of the message's user to add the user's image
               * from the room object the message belongs in
               */
              _id: message.user.user_id,
              name: message.user.user_name,
              avatar: getUserImageFromRoom(
                message.user.user_id,
                JSON.stringify(state.rooms[roomID])
              ),
            },
          };
          // Deletes unnecessary properties
          delete messages[message.message_id].message_id;
          delete messages[message.message_id].user_id;
          // Adds the message's ID and date to a list for sorting
          state.messageSort[roomID].push({
            _id: message.message_id,
            createdAt: message.createdAt,
          });
          /**
           * Updated the room object's last updated and text property with the
           * last message's date only if the message's date is newer than the
           * room's last updated date
           *
           * Temporary: In the future, the back-end should correctly set these properties
           */
          if (
            moment(message.createdAt).isSameOrAfter(
              state.rooms[roomID].lastUpdated
            )
          ) {
            state.rooms[roomID].lastMessage = message.text;
            state.rooms[roomID].lastUpdated = message.createdAt;
            state.sortRoomList.filter((room) => {
              // The numbers must be converted to string first to properly compare
              if (room.id.toString() === roomID.toString())
                room.lastUpdated = message.createdAt;
            });
            // Sorts the rooms objects
            state.sortRoomList.sort(
              (a, b) => moment(b.lastUpdated) - moment(a.lastUpdated)
            );
          }
        });

      // Creates a new message object with the room id as the key
      state.messages[roomID] = messages;
    },

    // User's messages list request started
    messagesReqStarted: (state, action) => {
      state.messagesLoading = true;
    },

    // Adds a message to the user's messsages based on room id
    addMessage: (state, action) => {
      // The room ID and message object
      let roomID, messageObj;

      /**
       * Correctly parses the data since it may have different formats
       */
      // If the message was fetched from the server
      if (action.passedData && action.passedData.singleMessageFromServer) {
        roomID = action.passedData.roomID;
        messageObj = action.payload;
        // Sets the correct message ID property
        messageObj._id = messageObj.message_id;
        delete messageObj.message_id;
        // Sets the correct user property
        messageObj.user = {
          _id: messageObj.user_id,
          name: messageObj.user_name,
          avatar: messageObj.user_avatar,
        };
      }
      // If the message was passed locally
      else {
        roomID = action.payload.roomID;
        messageObj = action.payload.messageObj;
      }

      /**
       * Checks to see if the room has messages. If not, new objects are
       * created to add messages to
       */
      if (!state.messages[roomID]) {
        state.messages[roomID] = {};
        state.messageSort[roomID] = [];
      }
      // The messages of the room
      const roomMessages = state.messages[roomID];
      // The list of sorted messages of the room
      let roomMessagesSorted = state.messageSort[roomID];

      /**
       * Checks to see if a message with the same ID is already saved.
       * If so, the message is not saved to prevent past messages from being
       * overwritten.
       */
      if (!roomMessages[messageObj._id]) {
        // Adds the message to the room's object of messages
        roomMessages[messageObj._id] = {
          // Creates a copy of the message object
          ...messageObj,
          // Modifies the user of the objects
          user: {
            // Creates a copy of the message's user object
            ...messageObj.user,
            /**
             * Modifies the avatar of the message's user to add the user's image
             * from the room object the message belongs in
             */
            avatar: getUserImageFromRoom(
              messageObj.user._id,
              JSON.stringify(state.rooms[roomID])
            ),
          },
        };
        // Adds the message to the room's sorted message list (at the beginning)
        roomMessagesSorted.splice(0, 0, {
          _id: messageObj._id,
          createdAt: messageObj.createdAt,
        });
        // Sorts the room's sorted message list
        roomMessagesSorted.sort(
          (a, b) => moment(b.createdAt) - moment(a.createdAt)
        );
        /**
         * Updated the room object's last updated and text property with the
         * last message's date only if the message's date is newer than the
         * room's last updated date
         */
        if (
          moment(messageObj.createdAt).isAfter(state.rooms[roomID].lastUpdated)
        ) {
          state.rooms[roomID].lastMessage = messageObj.text;
          state.rooms[roomID].lastUpdated = messageObj.createdAt;
          state.sortRoomList.filter((room) => {
            // The numbers must be converted to string first to properly compare
            if (room.id.toString() === roomID.toString())
              room.lastUpdated = messageObj.createdAt;
          });
          // Sorts the rooms objects
          state.sortRoomList.sort(
            (a, b) => moment(b.lastUpdated) - moment(a.lastUpdated)
          );
        }
        // Adds the notification's identifier in the list of of notification identifiers
        state.notificationIdentifiers.push(
          action.payload.notificationIdentifier
        );
      }
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
        if (message) {
          message.pending = false;
        }
        // Updates the room's lastUpdated and lastMessage properties
        if (room) {
          room.lastMessage = messageObj.text;
          room.lastUpdated = messageObj.createdAt;
        }
      }
    },

    // User's rooms list request failed
    messageReqFailed: (state, action) => {
      const error = JSON.parse(action.payload.error);
      state.fetchMessagesErrors[error.config.data] = error.message;
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

    /**
     * STATE RESET REDUCER
     */
    // Resets all the state's data
    resetState: (state, action) => {
      state.rooms = {};
      state.sortRoomList = [];
      state.roomsWithNewMessages = [];
      state.newRoomCreated = {
        roomCreated: false,
        roomID: null,
        roomLastUpdated: null,
      };
      state.createRoomLoading = false;
      state.notificationIdentifiers = [];
      state.messages = {};
      state.messageSort = {};
      state.fetchMessagesErrors = {};
      state.dataLoading = false;
      state.fetchRoomsError = false;
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
 * Returns the new room created property
 */
export const getNewRoomCreated = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.newRoomCreated.roomCreated
);

/**
 * Returns the new room created ID #
 */
export const getNewRoomCreatedID = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.newRoomCreated.roomID
);

/**
 * Returns the new room created last updated date
 */
export const getNewRoomCreatedLastUpdated = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.newRoomCreated.roomLastUpdated
);

/**
 * Returns the user's rooms's that has new messages
 */
export const getUserRoomsWithNewMessages = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.roomsWithNewMessages
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
 * Returns the loading status of creating a new room
 */
export const getCreateRoomLoading = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.createRoomLoading
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

/**
 * Returns a boolean determining if a notification's ID is already in the list
 * of notification IDs
 */
const isNotificationHandled = (notificationIdentifier) =>
  createSelector(
    (state) => state.entities.chat,
    (chat) => chat.notificationIdentifiers.includes(notificationIdentifier)
  );

/*********************************** ACTION CREATORS ***********************************/
/**
 * Fetches the user's list of rooms
 * @returns An action of fetching the user's list of rooms
 */
export const fetchRooms = (dispatch, getState) => {
  dispatch({ type: slice.actions.roomsReqFailed.type });
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
  const roomIDs = getUserRooms(getState());

  roomIDs.forEach((room) => {
    dispatch(
      apiRequested({
        url: "/dm/messages",
        method: "put",
        data: room.id.toString(), // Make sure it's a string or may cause a request error with Axios
        useEndpoint: true,
        onSuccess: slice.actions.userMessagesAdded.type,
        onError: slice.actions.messageReqFailed.type,
        onEnd: slice.actions.dataLoadingEnded.type,
      })
    );
  });
};

/**
 * Saves the user's message in the state and send the data to the back-end
 * @param {Object} stateMessage The message object formatted for the Redux state
 * @param {Object} backEndMessage The message object formatted for the back-end
 */
export const sendMessage = (stateMessage, backEndMessage) => (
  dispatch,
  getState
) => {
  // The room ID of the message
  const roomID = getSelectedRoomID(getState());
  // The room object associated with the message
  const roomObj = getUserRoomByID(roomID)(getState());

  // Adds the message to the state
  dispatch({
    type: slice.actions.addMessage.type,
    payload: {
      roomID,
      messageObj: stateMessage,
    },
  });

  // The push notification title
  backEndMessage.groupName = roomObj.group
    ? getRoomName(roomObj, getState().entities.profile.userInfo.data.ID)
    : backEndMessage.user.name;
  // The push notification body
  backEndMessage.groupText = roomObj.group
    ? `${backEndMessage.user.name}\n${backEndMessage.text}`
    : backEndMessage.text;
  // The push notification user IDs
  backEndMessage.users_ids = roomObj.users.map((user) => user.id);

  dispatch(
    apiRequested({
      url: "/dm/text",
      method: "put",
      data: backEndMessage,
      useEndpoint: true,
      onSuccess: slice.actions.updateMessagePending.type,
      passedData: {
        roomID,
        messageObj: backEndMessage,
      },
    })
  );
};

/**
 * Fetches the full message object from the server based
 * upon a push notifcation.
 * @param {object} request The notification's data
 * @param {Array} notificationTray The list of notifications in the notifications tray
 */
export const getFullMessageFromServer = (request, notificationTray) => (
  dispatch,
  getState
) => {
  /**
   * Checks to see if the notification ID is in the list of notification IDs.
   * This prevents an unnecessary fetch for the message's full object from being
   * made since it has already been done.
   */
  if (!isNotificationHandled(request.identifier)(getState())) {
    // The message's room ID
    const roomID = parseInt(request.content.data.roomID);
    // The message ID
    const messageID = request.content.data.messageID;

    // Fetches the full message from the back-end
    dispatch(
      apiRequested({
        url: "/dm/singleMessage",
        method: "put",
        data: { roomID, messageID },
        useEndpoint: true,
        onStart: slice.actions.addRoomIDToNewMessage.type,
        onSuccess: slice.actions.addMessage.type,
        passedData: {
          notificationIdentifier: request.identifier,
          notificationTray,
          roomID,
          singleMessageFromServer: true,
        },
      })
    );
  }
};

/**
 * Removes the room ID from the list of rooms with new message(s)
 * @param {number} roomID The room ID
 * @param {Array} notificationTray The list of notifications in the notifications tray
 */
export const removeRoomIDFromNewMessages = (roomID, notificationTray) => (
  dispatch,
  getState
) => {
  dispatch({
    type: slice.actions.removeRoomIDFromNewMessages.type,
    payload: { roomID, notificationTray },
  });
};

/**
 * Creates a new room
 * @param {Object} room The room object with the initial message to send
 *                      to the back-end
 */
export const createNewRoom = (room) => (dispatch, getState) => {
  // Corrects the message object's ID
  room.message.id = room.message._id;
  delete room.message._id;

  // Sets the loading status of creating a new room as true
  dispatch({ type: slice.actions.setCreateRoomLoading.type });

  // Sends the new room to the back-end
  dispatch(
    apiRequested({
      url: "/dm/",
      method: "post",
      data: JSON.stringify(room),
      useEndpoint: true,
      onSuccess: slice.actions.addRoom.type,
      onError: slice.actions.newRoomReqFailed.type,
    })
  );
};

/**
 * Resets the new rooms created property
 */
export const resetNewRoomCreated = (dispatch, getState) => {
  dispatch({ type: slice.actions.resetNewRoomCreated.type, payload: null });
};

/**
 * Resets all the state's data
 */
export const ent_ChatResetState = (dispatch, getState) => {
  dispatch({ type: slice.actions.resetState.type, payload: null });
};

/**
 * Fetches all data used by this slice from the server
 */
export const ent_ChatFetchAllData = (dispatch, getState) => {
  /**
   * The messages aren't fetched due to the Rooms component. In there,
   * there's a useEffect that handles fetching the user's messages after
   * the user's rooms are fetched. Therefore, only fetching the user's rooms
   * are required
   */
  dispatch(fetchRooms);
};

/*********************************** HELPER FUNCTIONS ***********************************/
/**
 * Retrieves the list of messages based upon room ID
 * @param {Object} chat The state of this reducer
 * @param {number} roomID The id of the room to retrieve messages from
 * @returns {Array} A list of the messages based upon the room ID
 */
const getListMessagesByID = (chat, roomID) => {
  // If the chat object and room ID is available
  if (JSON.stringify(chat) !== JSON.stringify({}) && roomID) {
    /**
     * Gets the list of messages for a room that's sorted in order from
     * newest to oldest date
     */
    const messages = chat.messageSort[roomID];
    /**
     * Returns a mapping of each text to retrieve the full message object
     * Conversion: { _id, createdAt } -> { _id, text, user_id, user, image, etc. }
     */
    return messages.map((text) => chat.messages[roomID][text._id]);
  }
  // If the chat object or room is not available, an empty list is returned
  else return [];
};

/**
 * Parses and corrects the room object
 * @param {Object} room The room object
 * @returns {Object} The corrected room object
 */
const correctedRoomObject = (room) => {
  return {
    image: room.roomImage,
    id: room.room_id,
    name: room.name,
    group: room.group,
    createdAt: room.createdAt,
    lastUpdated: room.lastUpdated,
    lastMessage: room.lastMessage,
    users: room.users.map((user) => {
      return {
        id: user.user_id,
        username: user.user_name,
        image: user.user_avatar,
      };
    }),
  };
};

/**
 * Parses and corrects the message object
 * @param {Object} message The message object
 * @returns {Object} The corrected message object
 */
export const correctedMessageObject = (message) => {
  // Reformats the message object for the back-end to parse correctly
  return {
    text: message.text,
    user: message.user,
    createdAt: moment(message.createdAt).format("YYYY-MM-DDTHH:mm:ss.SSS"),
    image: message.image ? message.image : null,
    audio: message.audio ? message.audio : null,
    video: message.video ? message.video : null,
    system: message.system ? message.system : false,
    received: message.received ? message.received : false,
    pending: false,
  };
};
