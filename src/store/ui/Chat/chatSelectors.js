import { createSelector } from "reselect";

/*********************************** SELECTORS ***********************************/
/**
 * Returns the text input's content size
 */
export const getTextInputContentSize = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.textInputContentSize
);

/**
 * Returns the initial text input's content height
 */
export const getInitialInputContentHeight = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.initialInputContentHeight
);

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
export const getNewRoomImage = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.newRoomImage
);

/**
 * Returns the room's name for creating a new room
 */
export const getNewRoomName = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.newRoomName
);

/**
 * Returns the value of navigating to the chat screen
 */
export const getShouldNavigateToChat = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.shouldNavigateToChat
);

/**
 * Returns the value of loading the user's chat data
 */
export const getShouldLoadFullChat = createSelector(
  (state) => state.ui.chat,
  (chat) => chat.shouldLoadFullChat
);

/**
 * Returns the content of a chat image
 * @param {string} imageID The ID of the image
 */
export const getImageContent = (imageID) =>
  createSelector(
    (state) => state.ui.chat,
    (chat) => chat.chatImages[imageID]
  );

/**
 * Returns the image of a room
 * @param {object} room The room object
 */
export const getImageFromRoom = (room) =>
  createSelector(
    (state) => state.ui.chat,
    (chat) =>
      room && room.image
        ? {
            uri: `data:image/gif;base64,${chat.chatImages[room.image]}`,
          }
        : null
  );
