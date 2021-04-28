import { createSlice, createAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "chat",
  initialState: {
    selectedRoomID: null,
    roomImage: null,
    roomName: "",
  },
  reducers: {
    /**
     *  ROOM REDUCERS
     */
    // Sets the user selected room ID to view its messages
    selectedRoom: (state, action) => {
      state.selectedRoomID = action.payload;
    },

    setRoomImage: (state, action) => {
      state.roomImage = action.payload;
    },

    setRoomName: (state, action) => {
      state.roomName = action.payload;
    },

    /**
     * STATE RESET REDUCER
     */
    // Resets all the state's data
    resetState: (state, action) => {
      state.selectedRoomID = null;
      state.roomImage = null;
      state.roomName = "";
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

/*********************************** ACTION CREATORS ***********************************/
/**
 * Sets the user selected room ID
 * @returns An action of selecting the room ID
 */
export const setRoomID = createAction(slice.actions.selectedRoom.type);

/**
 * Sets the room image for creating a room
 * @param image The image of the room
 */
export const setRoomImage = (image) => (dispatch, getState) => {
  dispatch({ type: slice.actions.setRoomImage.type, payload: image });
};

/**
 * Sets the room name for creating a room
 * @param name The name of the room
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
