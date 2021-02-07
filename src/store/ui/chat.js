import { createSlice, createAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "chat",
  initialState: {
    selectedRoomID: null,
  },
  reducers: {
    // Sets the user selected room ID to view its messages
    selectedRoom: (state, action) => {
      state.selectedRoomID = action.payload;
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

/*********************************** ACTION CREATORS ***********************************/
/**
 * Sets the user selected room ID
 * @returns An action of selecting the room ID
 */
export const setRoomID = createAction(slice.actions.selectedRoom.type);
