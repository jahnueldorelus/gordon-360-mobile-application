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
import { getUserInfo } from "./profile";
import { getChatOpenedAndVisible } from "../ui/chat";

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
    messagesLoading: [],
    messageSort: {},
    dataLoading: false,
    chatRequestsError: { rooms: false, messages: false },
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
        newSortRoomList.unshift({
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

    // Failed request for creating a new room
    newRoomReqFailed: (state, action) => {
      // Since there's no new room, default values are set
      state.newRoomCreated.roomCreated = false;
      state.newRoomCreated.roomID = null;
      // Resets the room creating loading
      state.createRoomLoading = false;
    },

    // Sets that the request for creating a new room is pending
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

      // Saves that a request for the user's rooms was successful
      state.chatRequestsError = { rooms: false, messages: false };
    },

    // User's rooms list request started
    roomsReqStarted: (state, action) => {
      // Resets the chat requests error
      state.chatRequestsError = { rooms: false, messages: false };
      // Saves that the users chat data is loading
      state.dataLoading = true;
      // Resets the list of current message requests
      state.messagesLoading = [];
    },

    // User's rooms list request failed
    roomsReqFailed: (state, action) => {
      // Saves that the request for the user's rooms failed
      state.chatRequestsError = { rooms: true, messages: false };
      /**
       * Since the request to fetch the rooms failed, no messages are fetched
       * and the request for the user's chat data ends
       */
      state.dataLoading = false;
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

      // Adds the notification's identifier in the list of of notification identifiers if existent
      if (action.passedData && action.passedData.notificationIdentifier) {
        state.notificationIdentifiers.push(
          action.passedData.notificationIdentifier
        );
      }
    },

    // Removes the room ID from the list of rooms with new messages
    handleRoomEnteredOrChanged: (state, action) => {
      // A copy of the notification tray list
      let notifcationTrayTemp = [...action.payload.notificationTray];

      // Check if the list of rooms with new messages contains the given room ID
      if (state.roomsWithNewMessages.includes(action.payload.roomID)) {
        // Removes the room ID from the list of rooms with new messages
        state.roomsWithNewMessages = state.roomsWithNewMessages.filter(
          (id) => id !== action.payload.roomID
        );

        // Removes the notification's ID from the list of notification IDs
        notifcationTrayTemp.forEach((notification, index) => {
          if (
            notification.request.content.data.roomID &&
            parseInt(notification.request.content.data.roomID) ===
              action.payload.roomID
          ) {
            // Removes the notification from the copy of the notification tray
            notifcationTrayTemp.splice(index, 1);
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

      /**
       * Removes any notifications in the list of notification identifiers
       * that are not in the notification's tray
       */
      state.notificationIdentifiers.forEach((identifier, index) => {
        if (
          notifcationTrayTemp.filter(
            (notification) => notification.request.identifier === identifier
          ).length === 0
        ) {
          state.notificationIdentifiers.splice(index, 1);
        }
      });
    },

    /**
     * MESSAGE REDUCERS
     */
    // Adds the list of messages for a room
    userMessagesAdded: (state, action) => {
      // The room ID where all messages will be placed
      let roomID = parseInt(action.config.data);
      // Temporary object that will contain all message objects
      let messages = {};
      // Creates a list for sorting the users messages based on room ID
      state.messageSort[roomID] = [];

      // Adds each message to the messages object
      if (action.payload && action.payload.length > 0) {
        action.payload.forEach((message, index) => {
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

          // Updates the room's last message property with the last message of the room
          if (index === 0) state.rooms[roomID].lastMessage = message.text;
        });
      }

      // Creates a new message object with the room id as the key
      state.messages[roomID] = messages;

      // Removes the room ID from the list of loading messages
      if (state.messagesLoading.includes(roomID)) {
        state.messagesLoading = state.messagesLoading.filter(
          (id) => id !== roomID
        );
      }

      // If there are no more loading messages, the chat request loading is done
      if (state.messagesLoading.length === 0) {
        // Sets the data loading to false
        state.dataLoading = false;
      }
    },

    // User's messages list request started
    messagesReqStarted: (state, action) => {
      // The requested messages room ID
      const roomID = action.passedData;
      // Saves the room ID for the room the messages are requested for
      if (!state.messagesLoading.includes(roomID)) {
        state.messagesLoading.push(roomID);
      }
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
        roomID = parseInt(action.passedData.roomID);
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
        roomMessagesSorted.unshift({
          _id: messageObj._id,
          createdAt: messageObj.createdAt,
        });

        // Sorts the room's sorted message list
        roomMessagesSorted.sort(
          (a, b) => moment(b.createdAt) - moment(a.createdAt)
        );

        /**
         * Updates the room object's last updated and text property with the
         * last message's date only if the message's date is newer than the
         * room's last updated date
         */
        if (
          moment(messageObj.createdAt).isAfter(state.rooms[roomID].lastUpdated)
        ) {
          state.rooms[roomID] = {
            ...state.rooms[roomID],
            /**
             * Updates the last message property of the room if the message object
             * has a text along with it
             */
            lastMessage: messageObj.text
              ? messageObj.text
              : state.rooms[roomID].lastMessage,
            // Updates the last updated property of the room
            lastUpdated: messageObj.createdAt,
          };

          // Updates the last updated property of the sorted list of rooms
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
      }
    },

    // Updates the pending status of a message
    updateMessagePending: (state, action) => {
      const serverSuccess = action.payload;
      // If the server successfully received the message
      if (serverSuccess) {
        const { roomID, messageObj } = action.passedData;
        const message = state.messages[roomID][messageObj.id];
        // Changes the message's pending status to false
        if (message) {
          message.pending = false;
        }
      }
    },

    // Saves that one of the user's messages request failed
    messageReqFailed: (state, action) => {
      // The requested messages room ID
      const roomID = action.passedData;

      // Removes the room ID from the list of loading messages
      if (state.messagesLoading.includes(roomID)) {
        // The index of the room ID in the list of loading messages
        state.messagesLoading = state.messagesLoading.filter(
          (id) => id !== roomID
        );
      }

      // Saves that a request for the user's messages failed
      state.chatRequestsError = { room: false, messages: true };

      // If there are no more loading messages, the chat request loading is done
      if (state.messagesLoading.length === 0) {
        state.dataLoading = false;
      }

      // Updates the room's last text property with the room's last message's text
      if (state.messages[roomID] && state.rooms[roomID]) {
        const room = state.rooms[roomID];
        // Gets the room's last message's ID
        const lastMessageID =
          state.messageSort[roomID].length > 0
            ? state.messageSort[roomID][0]._id
            : null;
        // Gets the room's last message's text if available
        const lastMessageText = state.messages[roomID][lastMessageID]
          ? state.messages[roomID][lastMessageID].text
          : null;
        // If the room has a last message the room's last message property is updated
        if (lastMessageText) room.lastMessage = lastMessageText;
      }
    },

    // Resets the data loading property to show that no more requests are being made
    stopDataLoading: (state, action) => {
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
      state.dataLoading = false;
      state.chatRequestsError = { rooms: false, messages: false };
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
 * Returns an object that holds the values of whether the request
 * for the user's list of rooms failed
 */
export const getChatRequestRoomsError = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.chatRequestsError.rooms
);

/**
 * Returns an object that holds the values of whether the request
 * for the user's messages failed
 */
export const getChatRequestMessagesError = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.chatRequestsError.messages
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

/**
 * Returns the list of messages that are currently being requested and
 * have not completed
 */
const getMessagesRequested = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.messagesLoading
);

/**
 * Returns the message object based upon room ID
 * @param {number} roomID The room ID of the messages to retrieve
 */
const getMessageObject = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.messages[roomID]
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
      onStart: slice.actions.roomsReqStarted.type,
    })
  );
};

/**
 * Fetches the user's messages
 * @returns An action of fetching the user's messages
 */
export const fetchMessages = () => (dispatch, getState) => {
  // List of rooms ids to fetch each room's messages
  const roomIDList = getUserRooms(getState());
  // List of messages that were requested
  const messagesRequested = getMessagesRequested(getState());

  // If there are no rooms, the retrieval of messages ends
  if (roomIDList.length === 0) {
    dispatch({ type: slice.actions.stopDataLoading.type });
  }

  roomIDList.forEach((room) => {
    const roomID = room.id;
    // Fetches the rooms messages if a request hasn't been made
    if (!messagesRequested.includes(roomID)) {
      dispatch(
        apiRequested({
          url: "/dm/messages",
          method: "put",
          data: roomID.toString(), // Make sure it's a string or may cause a request error with Axios
          useEndpoint: true,
          onStart: slice.actions.messagesReqStarted.type,
          onSuccess: slice.actions.userMessagesAdded.type,
          onError: slice.actions.messageReqFailed.type,
          passedData: roomID,
        })
      );
    }
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
  // The main user's ID
  const mainUserID = getUserInfo(getState()).ID;

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
  // backEndMessage.users_ids = roomObj.users
  //   .filter((user) => {
  //     if (user.id !== mainUserID) return user;
  //   })
  //   .map((user) => user.id);

  /**
   * For Development Only
   * This makes sure that the message sent only goes to the current
   * user. This allows for the other users in a group to not receive
   * multiple messages while testing the app.
   */
  backEndMessage.users_ids = [mainUserID];

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
  // The message's room ID
  const roomID = parseInt(request.content.data.roomID);
  // The message ID
  const messageID = request.content.data.messageID;
  // Redux State
  const state = getState();

  // Checks to make sure the state is availale
  if (state && state.entities && state.entities.chat) {
    /**
     * Checks to see if the notification ID is in the list of notification IDs.
     * If so, no fetch is done. Otherwise, the message is fetched from the server
     */
    if (
      // Checks if the notification's has already been handled
      !isNotificationHandled(request.identifier)(getState())
    ) {
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
  }
};

/**
 * Removes the room ID from the list of rooms with new message(s)
 * @param {number} roomID The room ID
 * @param {Array} notificationTray The list of notifications in the notifications tray
 */
export const handleRoomEnteredOrChanged = (roomID, notificationTray) => (
  dispatch,
  getState
) => {
  const isChatVisibleAndOpened = getChatOpenedAndVisible(getState());

  dispatch({
    type: slice.actions.handleRoomEnteredOrChanged.type,
    payload: { roomID, notificationTray, isChatVisibleAndOpened },
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
