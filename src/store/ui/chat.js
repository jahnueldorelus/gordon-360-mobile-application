import { createSlice, createAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "chat",
  initialState: {
    selectedRoomID: null,
    isChatOpenedAndVisible: false,
    roomImage: null,
    roomName: "",
    shouldNavigateToChat: false,
  },
  reducers: {
    /**
     *  ROOM REDUCERS
     */
    // Sets the user selected room ID to view its messages
    selectedRoom: (state, action) => {
      state.selectedRoomID = action.payload;
    },

    // Sets the value of if a chat is opened and visible
    setChatOpenedAndVisible: (state, action) => {
      state.isChatOpenedAndVisible = action.payload;
    },

    // Sets the room image of creating a new room
    setRoomImage: (state, action) => {
      state.roomImage = action.payload;
    },

    // Sets the room name of creating a new room
    setRoomName: (state, action) => {
      state.roomName = action.payload;
    },

    // Set the value of navigating to the chat screen
    setShouldNavigateToChat: (state, action) => {
      state.shouldNavigateToChat = action.payload;
    },

    /**
     * STATE RESET REDUCER
     */
    // Resets all the state's data
    resetState: (state, action) => {
      state.selectedRoomID = null;
      state.isChatOpenedAndVisible = false;
      state.roomImage = null;
      state.roomName = "";
      state.shouldNavigateToChat = false;
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/*********************************** SELECTORS ***********************************/
/**
 * Returns the user's selected room ID
 */
export const getSelectedRoomID = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.selectedRoomID
);

/**
 * Determines if a chat is opened
 */
export const getChatOpenedAndVisible = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.isChatOpenedAndVisible
);

/**
 * Returns the room's image for creating a new room
 */
export const getRoomImage = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.roomImage
);

/**
 * Returns the room's name for creating a new room
 */
export const getRoomName = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.roomName
);

/**
 * Returns the value of navigating to the chat screen
 */
export const getShouldNavigateToChat = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.shouldNavigateToChat
);

/*********************************** ACTION CREATORS ***********************************/
/**
 * Sets the user selected room ID
 */
export const setRoomID = createAction(slice.actions.selectedRoom.type);

/**
 * Sets the value of whether or not the app should navigate to the chat screen
 */
export const setShouldNavigateToChat = createAction(
  slice.actions.setShouldNavigateToChat.type
);

/**
 * Sets the value of if a chat is opened and visible
 * @param {boolean} opened The value of if a chat is opened and visible
 */
export const setChatOpenedAndVisible = (opened) => (dispatch, getState) => {
  dispatch({
    type: slice.actions.setChatOpenedAndVisible.type,
    payload: opened,
  });
};

/**
 * Sets the room image for creating a room
 * @param {string} image The image of the room
 */
export const setRoomImage = (image) => (dispatch, getState) => {
  dispatch({ type: slice.actions.setRoomImage.type, payload: image });
};

/**
 * Sets the room name for creating a room
 * @param {string} name The name of the room
 */
export const setRoomName = (name) => (dispatch, getState) => {
  dispatch({ type: slice.actions.setRoomName.type, payload: name });
};

/**
 * Resets all the state's data
 */
export const ui_ChatResetState = (dispatch, getState) => {
  dispatch({ type: slice.actions.resetState.type, payload: null });
};
