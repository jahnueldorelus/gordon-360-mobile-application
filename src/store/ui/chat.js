import { createSlice, createAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "chat",
  initialState: {
    selectedRoomID: null,
    createRoomLoading: false,
  },
  reducers: {
    // Sets the user selected room ID to view its messages
    selectedRoom: (state, action) => {
      state.selectedRoomID = action.payload;
    },

    setCreateRoomLoading: (state, action) => {
      state.createRoomLoading = action.payload;
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
 * Returns the loading status of creating a new room
 */
export const getCreateRoomLoading = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.createRoomLoading
);

/*********************************** ACTION CREATORS ***********************************/
/**
 * Sets the user selected room ID
 * @returns An action of selecting the room ID
 */
export const setRoomID = createAction(slice.actions.selectedRoom.type);

/**
 * Sets the loading status of creating a room as true
 */
export const setCreateRoomLoading = (dispatch, getState) => {
  dispatch({ type: slice.actions.setCreateRoomLoading.type, payload: true });
};

/**
 * Sets the loading status of creating a room as false
 */
export const resetCreateRoomLoading = (dispatch, getState) => {
  dispatch({ type: slice.actions.setCreateRoomLoading.type, payload: false });
};
