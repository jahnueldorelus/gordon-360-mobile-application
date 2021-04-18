import { createRef } from "react";
import { setRoomID } from "../../store/ui/chat";

// Determines if the navigation is ready to be used
export const isReadyRef = createRef();
// The navigation reference
export const navigationRef = createRef();

/**
 * Navigates to a chat
 * @param {*} dispatch Redux dispatch
 * @param {number} roomID The ID of the room to navigate to
 */
export const navigateToChat = (dispatch, roomID) => {
  if (navigationAvailable) {
    // Sets the user's selected room ID
    dispatch(setRoomID(roomID));
    // Perform navigation if the app has mounted
    navigationRef.current.navigate("Chat", { roomID });
  }
};

/**
 * Gets the route object from the navigation
 */
export const getNavigationRoute = () =>
  navigationAvailable ? navigationRef.current.getCurrentRoute() : null;

/**
 * Determines if the navigation object is available
 * @returns {boolean} The result of whether navigation is available
 */
const navigationAvailable = () => {
  return isReadyRef.current && navigationRef.current;
};
