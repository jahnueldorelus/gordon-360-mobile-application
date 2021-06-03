import { createSlice, createAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiRequested } from "../middleware/api";
import { getSelectedRoomID } from "../ui/Chat/chatSelectors";
import { setImage } from "../ui/Chat/chat";
import moment from "moment";
import { Promise } from "bluebird";
import {
  getRoomName,
  getUserImageFromRoom,
  saveImageToDevice,
  getImageID,
} from "../../Services/Messages/index";
import {
  getToken,
  getAPI,
  getAPIEndpoint,
} from "../entities/Auth/authSelectors";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { getUserInfo } from "./profile";
import { getChatOpenedAndVisible } from "../ui/Chat/chatSelectors";

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
    tempMessages: {},
    dataLoading: false,
    chatRequestsError: { rooms: false, messages: false },
    chatUsersImages: {},
    chatUsersImagesRequests: {},
  },
  reducers: {
    /**
     * ROOM REDUCERS
     */
    addRoom: (state, action) => {
      // Creates a copy of the rooms sort list
      const newSortRoomList = state.sortRoomList.slice();
      // Parses the data
      let newRoom =
        action.passedData && action.passedData.singleRoomFromServer
          ? // If the room object is a single room from the server
            action.payload[0]
          : // If the room object was received locally
            action.payload;
      // Formats the room object to be parsed correctly
      newRoom = parseChatObject(newRoom, action.passedData);

      /**
       * Checks to make sure there's not a duplicate room. If there is,
       * the newer room object is not saved
       */
      if (
        newSortRoomList.filter((prevRoom) => prevRoom.id === newRoom.id)
          .length === 0
      ) {
        // Adds the room's ID to the sorted list of rooms
        newSortRoomList.unshift({
          id: newRoom.id,
          lastUpdated: newRoom.lastUpdated,
        });

        // Sorts the room list to be listed in the correct order by date
        state.sortRoomList = newSortRoomList.sort(
          (a, b) => moment(b.lastUpdated) - moment(a.lastUpdated)
        );

        /**
         * Changes the image property to the image's ID (aka filename) since
         * the image is saved to a file in another function
         */
        newRoom.image = newRoom.image ? getImageID(newRoom.id) : null;

        // Adds the room to the rooms object
        state.rooms[newRoom.id] = newRoom;

        // Shows in the state that a new room was created and sets it's ID
        state.newRoomCreated = {
          roomCreated: true,
          roomID: newRoom.id,
          roomLastUpdated: newRoom.lastUpdated,
        };
        // Resets the room loading status of creating a room
        state.createRoomLoading = false;

        /**
         * Checks to see if the room has any temporary messages.
         * If so those messages are saved to the state and deleted
         * from the object of temporary messages
         */
        if (state.tempMessages[newRoom.id]) {
          const tempMessages = state.tempMessages[newRoom.id];
          tempMessages.forEach((messageAction) => {
            // Saves the message to the state
            slice.caseReducers.addMessage(state, messageAction);
          });
          // Deletes the temporary messages
          delete state.tempMessages[newRoom.id];
        }
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
      // If the list of rooms isn't empty
      if (action.payload.length > 0) {
        // New sort list
        let newSortList = [];

        // Goes through the list of rooms and modifies its properties
        action.payload.forEach((obj) => {
          const room = obj[0];
          // Checks to make sure the room object is existent
          if (room) {
            // Formats the room object to be parsed correctly
            const newRoom = parseChatObject(room);

            /**
             * Changes the image property to the image's ID (aka filename) since
             * the image is saved to a file in another function
             */
            newRoom.image = newRoom.image ? getImageID(newRoom.id) : null;

            // Saves the name of each user in each room to fetch their images later
            newRoom.users.forEach((user) => {
              // Adds the user's property to the object of user's images if not existent
              if (!state.chatUsersImages[user.username])
                state.chatUsersImages[user.username] = user.image;
            });

            // Adds room data to the sort list
            newSortList.push({
              id: room.room_id,
              lastUpdated: room.lastUpdated,
            });

            // Adds the room to the rooms object
            state.rooms[room.room_id] = newRoom;
          }
        });

        // Sorts the list in order by the last updated date
        state.sortRoomList = newSortList.sort(
          (a, b) => moment(b.lastUpdated) - moment(a.lastUpdated)
        );

        // Saves that a request for the user's rooms was successful
        state.chatRequestsError = { rooms: false, messages: false };
      } else {
        // Since the list of rooms is empty, fetching for the user's data is done
        state.dataLoading = false;
      }
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
            state.notificationIdentifiers =
              state.notificationIdentifiers.filter(
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
      const roomID = parseInt(action.config.data);
      // An object that will contain all message objects
      const messages = {};
      // Creates a list for sorting the users messages based on room ID
      state.messageSort[roomID] = [];

      // Adds each message to the messages object
      if (action.payload && action.payload.length > 0) {
        action.payload.forEach((message, index) => {
          // The message object to be added to the state
          const messageObj = parseChatObject(message, {
            // You must stringify and parse state data or output will be different
            room: JSON.parse(JSON.stringify(state.rooms[roomID])),
          });

          /**
           * Changes the image property to the image's ID (aka filename) since
           * the image is saved to a file in another function
           */
          messageObj.image = messageObj.image
            ? getImageID(roomID, messageObj._id)
            : null;
          // Adds the message object to the object of messages
          messages[message.message_id] = messageObj;
          // Adds the message's ID and date to a list for sorting
          state.messageSort[roomID].push({
            _id: messageObj._id,
            createdAt: messageObj.createdAt,
          });
          // Updates the room's last message property with the last message of the room
          if (index === 0) state.rooms[roomID].lastMessage = messageObj.text;
        });
      }

      // Creates a new message object with the room id as the key
      state.messages[roomID] = messages;

      // Removes any temporary messages saved for the room
      delete state.tempMessages[roomID];

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
      // If the room doesn't exist, the data is saved temporarily
      if (
        !state.rooms[
          // The room ID can either be in the action's payload or passed data
          action.passedData && action.passedData.roomID
            ? action.passedData.roomID
            : action.payload.roomID
        ]
      ) {
        // Saves the room ID
        roomID =
          action.passedData && action.passedData.roomID
            ? action.passedData.roomID
            : action.payload.roomID;
        // If temporary messages hasn't been created for the room, it's created
        if (!state.tempMessages[roomID]) state.tempMessages[roomID] = [];
        // Saves the reducer's action to the temporary messages
        state.tempMessages[roomID].push(action);
      }
      // If the room does exist
      else {
        // The room ID of the message
        roomID =
          // Checks to see if the message was received locally or from the server
          action.passedData && action.passedData.singleMessageFromServer
            ? // If message was received from the server
              parseInt(action.passedData.roomID)
            : // If message was received locally
              action.payload.roomID;
        // The message object to be added to the state
        messageObj = parseChatObject(
          action.payload && action.payload.messageObj
            ? // If the message object was received locally
              action.payload.messageObj
            : // If the message object was received remotely
              action.payload,
          {
            ...action.passedData,
            // You must stringify and parse state data or output will be different
            room: JSON.parse(JSON.stringify(state.rooms[roomID])),
          }
        );

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
          /**
           * Removes the message's image as it will be saved in another function
           */
          messageObj.image = null;

          // Adds the message to the room's object of messages
          roomMessages[messageObj._id] = messageObj;

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
           * room's last updated date or there's only one message in the chat
           */
          if (
            moment(messageObj.createdAt).isAfter(
              state.rooms[roomID].lastUpdated
            ) ||
            Object.keys(state.messages[roomID]).length === 1
          ) {
            state.rooms[roomID] = {
              ...state.rooms[roomID],
              /**
               * Updates the last message property of the room if the message object
               * has a text along with it
               */
              lastMessage: messageObj.text
                ? // If the message object has text
                  messageObj.text
                : messageObj.image
                ? // If the message object doesn't have text but has an image
                  "(Image)"
                : // If the message object neither has text or an image
                  state.rooms[roomID].lastMessage,
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
      }
    },

    // Saves the image ID of a message
    updateMessageImage: (state, action) => {
      // Gets the content of the payload
      const { roomID, messageID, imageID } = action.payload;
      console.log("Updating Message Image:\n\t", {
        roomID,
        messageID,
        imageID,
      });
      // Saves the message's image ID
      const message = state.messages[roomID][messageID];
      if (message) message.image = imageID;
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
     * IMAGE REDUCER
     */
    // Saves all user' images
    saveUserImages: (state, action) => {
      // Adds all images of the users to the state
      action.payload.forEach((person) => {
        // Gets the person's image and username
        const { def, pref, username } = person;
        // Does a check to make sure all properties are available
        if ((def || pref) && username) {
          // Saves the person's image if available
          state.chatUsersImages[username] = pref
            ? // Saves the preferred image if available
              pref
            : def
            ? // Saves the default image if preferred image is unavailable
              def
            : // Saves nothing if no image is available
              null;
        }
      });

      // Resets the network requests of each user
      state.chatUsersImagesRequests = {};
    },

    // Saves the list of requests made for each user
    userImageRequestAdded: (state, action) => {
      if (!state.chatUsersImagesRequests[action.payload.user])
        state.chatUsersImagesRequests[action.payload.user] = true;
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
      state.tempMessages = {};
      state.dataLoading = false;
      state.chatRequestsError = { rooms: false, messages: false };
      state.chatUsersImages = {};
      state.chatUsersImagesRequests = {};
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
 * Returns the list of chat user images
 */
const getChatUsersImages = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.chatUsersImages
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
  getChatUsersImages,
  (rooms, sortList, chatUserImages) =>
    sortList.map((room) => ({
      ...rooms[room.id],
      // Gets the users' images in the room
      users: [
        ...rooms[room.id].users.map((user) => ({
          ...user,
          image: chatUserImages[user.username],
        })),
      ],
    }))
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
    getChatUsersImages,
    (chat, chatUserImages) =>
      chat.rooms[id]
        ? {
            ...chat.rooms[id],
            // Gets the users' images in the room
            users: [
              ...chat.rooms[id].users.map((user) => ({
                ...user,
                image: chatUserImages[user.username],
              })),
            ],
          }
        : null
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
 * Returns the message's image by ID
 * @param {String} roomID The id of the room
 * @param {String} messageID The id of the message
 */
export const getMessageImageByID = (roomID, messageID) =>
  createSelector(
    (state) => state.entities.chat,
    (chat) => chat.messages[roomID][messageID].image
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
 * Returns the users whose image has already been requested
 */
const getUsersWithImageRequested = createSelector(
  (state) => state.entities.chat,
  (chat) => chat.chatUsersImagesRequests
);

/**
 * Returns the users whose image should be requested
 */
const getUsersnamesForImageRequest = createSelector(
  (state) => state.entities.chat,
  (chat) => Object.keys(chat.chatUsersImages)
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
      successCallback: saveChatObjectsImage,
      onError: slice.actions.roomsReqFailed.type,
      onStart: slice.actions.roomsReqStarted.type,
    })
  );
};

/**
 * Fetches the user's messages
 * @returns An action of fetching the user's messages
 */
export const fetchMessages = (dispatch, getState) => {
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
          successCallback: saveChatObjectsImage,
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
export const sendMessage =
  (stateMessage, backEndMessage) => (dispatch, getState) => {
    // The room ID of the message
    const roomID = getSelectedRoomID(getState());
    // The room object associated with the message
    const roomObj = getUserRoomByID(roomID)(getState());
    // The main user's ID
    const mainUserID = getUserInfo(getState()).ID;
    // Temp copy of the state message to be used to save the message's image
    const tempStateMessage = { ...stateMessage };

    /**
     * Adds the message to the state. The message must be
     * saved to the state before its image is saved so that
     * the message isn't missing in the state when trying to save
     * its image
     */
    dispatch({
      type: slice.actions.addMessage.type,
      payload: {
        roomID,
        messageObj: stateMessage,
      },
    });

    /**
     * Saves the message's image to the UI state
     * WARNING: Make sure to only use the backEndMessage variable for
     * dispatching to set the image since it's untouched. This is due
     * to the variable stateMessage being modified by the dispatch
     * to "addMessage" that causes errors when accessing its data.
     */
    if (tempStateMessage.image && tempStateMessage._id) {
      saveChatObjectsImage(
        {
          type: slice.actions.addMessage.type,
          payload: tempStateMessage,
          passedData: { roomID },
        },
        dispatch
      );
    }

    // The push notification title
    backEndMessage.groupName = roomObj.group
      ? getRoomName(roomObj, getState().entities.profile.userInfo.data.ID)
      : backEndMessage.user.name;
    // The push notification body
    backEndMessage.groupText = roomObj.group
      ? `${backEndMessage.user.name}\n${backEndMessage.text}`
      : backEndMessage.text;
    // The push notification user IDs
    backEndMessage.users_ids = roomObj.users
      .filter((user) => {
        if (user.id !== mainUserID) return user;
      })
      .map((user) => user.id);

    /**
     * For Development Only
     * This makes sure that the message sent only goes to the main
     * user. This allows for the other users in a group to not receive
     * multiple messages while testing the app in development mode
     */
    // if (__DEV__) backEndMessage.users_ids = [mainUserID];

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
export const getFullMessageFromServer =
  (request, notificationTray) => (dispatch, getState) => {
    // The message's room ID
    const roomID = parseInt(request.content.data.roomID);
    // The rooms object
    const roomObj = getRooms(getState());
    // The message ID
    const messageID = request.content.data.messageID;

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
          successCallback: saveChatObjectsImage,
          passedData: {
            notificationIdentifier: request.identifier,
            notificationTray,
            roomID,
            singleMessageFromServer: true,
          },
        })
      );

      // Checks to see if the room is existent. If not, the room is fetched
      if (!roomObj[roomID])
        dispatch(
          apiRequested({
            url: "/dm/singleRoom",
            method: "post",
            data: roomID.toString(), // Make sure it's a string or may cause a request error with Axios,
            useEndpoint: true,
            onSuccess: slice.actions.addRoom.type,
            successCallback: saveChatObjectsImage,
            passedData: {
              singleRoomFromServer: true,
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
export const handleRoomEnteredOrChanged =
  (roomID, notificationTray) => (dispatch, getState) => {
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
      successCallback: saveChatObjectsImage,
      onError: slice.actions.newRoomReqFailed.type,
    })
  );
};

/**
 * Fetches each chat user's image based on their username.
 * The fetch is done here and not through the middleware "api.js" due to
 * concurrency issues. If the list of people contain more than 500 people, this
 * will cause an error as there's a maximum limit of 500 callbacks. Therefore,
 * the fetch is used here in order to use Bluebird which helps control the
 * concurrency of each fetch to prevent the 'excessive number of callbacks' error
 * from occuring. The maximum amount of pending requests made at a time is 50
 *
 */
export const fetchChatUsersImages = (dispatch, getState) => {
  // List of usernames to fetch images for
  const usernames = getUsersnamesForImageRequest(getState());
  // Object of users whose image has already been requested
  const usersWithRequest = getUsersWithImageRequested(getState());
  const userImages = Promise.map(
    usernames,
    async (user) => {
      /**
       * Checks to see if a fetch wasn't made and if the user
       * doesn't have an image already stored
       */
      if (!usersWithRequest[user]) {
        // Saves the name of every user to prevent a re-fetch from occuring
        dispatch({
          type: slice.actions.userImageRequestAdded.type,
          payload: { user: user },
        });
        // Does the request for the person's image
        return await axios({
          baseURL: getAPI(getState()),
          url: getAPIEndpoint(getState()) + `/profiles/Image/${user}/`,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${getToken(getState())}`,
            "Content-Type": "application/json",
          },
        })
          // Returns a response with the name of the person associated with the request
          .then((response) => {
            return { ...response.data, username: user };
          });
      } else {
        return false; // Returns an empty object
      }
    },
    // Creates a limit of 50 pending requests at a time
    { concurrency: 50 }
  );
  // Saves the list of user images
  userImages.then((results) => {
    dispatch(saveUserImagesList(results));
  });
};

/**
 * Saves a list of user images
 */
export const saveUserImagesList = createAction(
  slice.actions.saveUserImages.type
);

/**
 * Resets the new rooms created property
 */
export const resetNewRoomCreated = createAction(
  slice.actions.resetNewRoomCreated.type
);

/**
 * Resets all the state's data
 */
export const ent_ChatResetState = createAction(slice.actions.resetState.type);

/*********************************** HELPER FUNCTIONS ***********************************/
/**
 * Retrieves the list of messages based upon room ID
 * @param {Object} chat The state of this reducer
 * @param {number} roomID The id of the room to retrieve messages from
 * @returns {Array} A list of the messages based upon the room ID
 */
const getListMessagesByID = (chat, roomID) => {
  // If the room ID is available
  if (roomID) {
    /**
     * Gets the list of messages for a room that's sorted in order from
     * newest to oldest date
     */
    const messages = chat.messageSort[roomID];
    /**
     * Returns a mapping of each text to retrieve the full message object
     * Conversion: { _id, createdAt } -> { _id, text, user_id, user, image, etc. }
     */
    return messages
      ? messages.map((text) => chat.messages[roomID][text._id])
      : [];
  }
  // If the chat object or room is not available, an empty list is returned
  else return [];
};

/**
 * Parses the chat object to extract needed information.
 * This handles chat objects received locally and from the server.
 * This must be used ONLY within reducers. Don't export this function.
 * @param {object} chatObject Either a room or message object
 * @param {*} passedData (If available) Extra data passed along that corresponds to the chat object
 * @returns {object} The parsed chat object in the correct format to be used in reducers
 */
export const parseChatObject = (chatObject, passedData = null) => {
  // Temporary variable that will hold the new parsed chat object
  let newChatObject = null;
  // Determines if the chat object is a room or message object
  const isRoomObject = chatObject.hasOwnProperty("group");

  /**
   * Handles objects that are room objects
   */
  if (isRoomObject) {
    newChatObject = {
      image: chatObject.roomImage,
      id: chatObject.room_id ? chatObject.room_id : chatObject.id,
      name: chatObject.name,
      group: chatObject.group,
      createdAt: chatObject.createdAt,
      lastUpdated: chatObject.lastUpdated,
      lastMessage: chatObject.lastMessage ? chatObject.lastMessage : "",
      users: chatObject.users.map((user) => {
        return {
          id: user.user_id,
          username: user.user_name,
          image: user.user_avatar,
        };
      }),
    };
  } else {
    /**
     * Hanldes objects that are message objects
     */
    // The room object the message belongs to
    newChatObject = {
      _id: chatObject.message_id ? chatObject.message_id : chatObject._id,
      text: chatObject.text,
      createdAt: moment(chatObject.createdAt).format("YYYY-MM-DDTHH:mm:ss.SSS"),
      image: chatObject.image ? chatObject.image : null,
      audio: chatObject.audio ? chatObject.audio : null,
      video: chatObject.video ? chatObject.video : null,
      system: chatObject.system ? chatObject.system : false,
      received: chatObject.received ? chatObject.received : false,
      pending: chatObject.pending ? chatObject.pending : false,
      user: {
        _id: chatObject.user
          ? chatObject.user.user_id
            ? chatObject.user.user_id
            : chatObject.user._id
          : null,
        name: chatObject.user
          ? chatObject.user.user_name
            ? chatObject.user.user_name
            : chatObject.user.name
          : null,
        avatar:
          // If the room object is available
          passedData && passedData.room
            ? getUserImageFromRoom(
                chatObject.user
                  ? chatObject.user.user_id
                    ? chatObject.user.user_id
                    : chatObject.user._id
                  : null,
                passedData.room
              )
            : // If the room object isn't available
            chatObject.user
            ? chatObject.user.user_avatar
              ? chatObject.user.user_avatar
              : chatObject.user.avatar
            : null,
      },
    };
  }

  // Returns the new parsed chat object
  return newChatObject;
};

/**
 * Saves the user's chat images to the UI state and storage
 * This should be used ONLY as a callback for a successful
 * API request. Don't export this function.
 *
 * @param {object} data The response of the API request
 * @param {*} dispatch Redux dispatch
 */
const saveChatObjectsImage = (data, dispatch) => {
  // Lists of images, room, and message IDs
  const images = [],
    roomIDs = [],
    messageIDs = [];

  // Handles response sent to 'addRoom'
  if (data.type === slice.actions.addRoom.type) {
    // Formats the room object to be parsed correctly
    const newRoom = parseChatObject(data.payload, data.passedData);
    // Adds the data to the lists to be saved to the UI and the device's storage
    images.push(newRoom.image);
    roomIDs.push(newRoom.id);
    messageIDs.push(null);
  }

  // Handles response sent to 'userRoomsAdded'
  else if (data.type === slice.actions.userRoomsAdded.type) {
    // Iterates through the list of room objects
    data.payload.forEach((obj) => {
      // The room object
      const room = obj[0];
      // Checks to make sure the room object is existent
      if (room) {
        // Formats the room object to be parsed correctly
        const newRoom = parseChatObject(room);
        // Adds the data to the lists to be saved to the UI and the device's storage
        images.push(newRoom.image);
        roomIDs.push(newRoom.id);
        messageIDs.push(null);
      }
    });
  }

  // Handles response sent to 'addMessage'
  else if (data.type === slice.actions.addMessage.type) {
    // The room ID of the message
    const roomID = parseInt(data.passedData.roomID);
    // Formats the message object to be parsed correctly
    const messageObj = parseChatObject(data.payload, {
      ...data.passedData,
    });
    // Adds the data to the lists to be saved to the UI and the device's storage
    images.push(messageObj.image);
    roomIDs.push(roomID);
    messageIDs.push(messageObj._id);
  }

  // Handles response sent to 'userMessagesAdded'
  else if (data.type === slice.actions.userMessagesAdded.type) {
    // The room ID of all the message objects
    const roomID = parseInt(data.config.data);
    // Iterates through each message object
    if (data.payload && data.payload.length > 0) {
      data.payload.forEach((messageObj) => {
        // Formats the message object to be parsed correctly
        const newMessageObj = parseChatObject(messageObj, {
          ...data.passedData,
        });
        // Adds the data to the lists to be saved to the UI and the device's storage
        images.push(newMessageObj.image);
        roomIDs.push(roomID);
        messageIDs.push(newMessageObj._id);
      });
    }
  }

  /**
   * Iterates through the list of images and saves them to the
   * device and the UI state
   */
  images.forEach((image, index) => {
    // Checks to make sure there's an image before attempting to save images
    if (image) {
      // The image's ID
      const imageID = getImageID(roomIDs[index], messageIDs[index]);
      // Saves the image to the UI state
      dispatch(setImage(imageID, image));
      /**
       * If the response was sent to 'addMessage', the message's
       * image ID is saved to the message object after its image
       * has been saved to the UI.
       */
      if (data.type === slice.actions.addMessage.type) {
        dispatch({
          type: slice.actions.updateMessageImage.type,
          payload: {
            roomID: roomIDs[index],
            messageID: messageIDs[index],
            imageID,
          },
        });
      }
      // Saves the image to the device
      saveImageToDevice(image, roomIDs[index], messageIDs[index]);
    }
  });
};
