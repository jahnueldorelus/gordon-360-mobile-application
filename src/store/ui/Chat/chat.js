import { createSlice, createAction } from "@reduxjs/toolkit";

/*********************************** SLICE ***********************************/
const slice = createSlice({
  name: "chat",
  initialState: {
    selectedRoomID: null,
    isChatOpenedAndVisible: false,
    newRoomImage: null,
    newRoomName: "",
    shouldNavigateToChat: false,
    chatImages: {},
    shouldLoadFullChat: false,
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
    setNewRoomImage: (state, action) => {
      state.newRoomImage = action.payload;
    },

    // Sets the room name of creating a new room
    setNewRoomName: (state, action) => {
      state.newRoomName = action.payload;
    },

    // Set the value of navigating to the chat screen
    setShouldNavigateToChat: (state, action) => {
      state.shouldNavigateToChat = action.payload;
    },

    // Adds an image from a chat whether it's a room or message image
    addChatImage: (state, action) => {
      state.chatImages[action.payload.imageID] = action.payload.content;
    },

    // Sets the value of loading the user's chat data
    setLoadFullChat: (state, action) => {
      state.shouldLoadFullChat = action.payload === true ? true : false;
    },

    /**
     * STATE RESET REDUCER
     */
    // Resets all the state's data
    resetState: (state, action) => {
      state.selectedRoomID = null;
      state.isChatOpenedAndVisible = false;
      state.newRoomImage = null;
      state.newRoomName = "";
      state.shouldNavigateToChat = false;
      state.chatImages = {};
      state.shouldLoadFullChat = true;
    },
  },
});

/*************************** DEFAULT REDUCER ***************************/
export default slice.reducer;

/*********************************** ACTION CREATORS ***********************************/
/**
 * Sets the user selected room ID
 */
export const setRoomID = createAction(slice.actions.selectedRoom.type);

/**
 * Sets the value of whether or not the user's full chat data should be fetched
 */
export const setLoadFullChatData = createAction(
  slice.actions.setLoadFullChat.type
);

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
export const setNewRoomImage = (image) => (dispatch, getState) => {
  dispatch({ type: slice.actions.setNewRoomImage.type, payload: image });
};

/**
 * Sets the room name for creating a room
 * @param {string} name The name of the room
 */
export const setNewRoomName = (name) => (dispatch, getState) => {
  dispatch({ type: slice.actions.setNewRoomName.type, payload: name });
};

/**
 * Saves an image to the state
 * @param {string} imageID The ID of the image
 * @param {string} content The content of the image
 */
export const setImage = (imageID, content) => (dispatch, getState) => {
  // Checks if the image's ID and content exists
  if (imageID && content) {
    dispatch({
      type: slice.actions.addChatImage.type,
      payload: { imageID, content },
    });
  }
};

/**
 * Resets all the state's data
 */
export const ui_ChatResetState = (dispatch, getState) => {
  dispatch({ type: slice.actions.resetState.type, payload: null });
};
