import React, { useEffect } from "react";
import {
  getSelectedRoomID,
  getShouldNavigateToChat,
} from "../../../store/ui/Chat/chatSelectors";
import {
  handleRoomEnteredOrChanged,
  getUserMessagesByID,
  getUserRoomByID,
  getUserRoomsWithNewMessages,
} from "../../../store/entities/chat";
import { getAppbarHeight } from "../../../store/ui/app";
import * as Notifications from "expo-notifications";
import { useDispatch, useSelector } from "react-redux";
import { LoadingScreen } from "../../../Components/LoadingScreen";
import ChatUI from "./Components/ChatUI/index";

export const ChatView = () => {
  // Redux Dispatch
  const dispatch = useDispatch();
  // The selected room's ID
  const roomID = useSelector(getSelectedRoomID);
  // User's selected room
  const currentRoom = useSelector(getUserRoomByID(roomID));
  // The selected room's messages
  const userMessages = useSelector(getUserMessagesByID(roomID));
  // The appbar's height
  const appbarHeight = useSelector(getAppbarHeight);
  // The user's list of rooms with new messages
  const roomsWithNewMessages = useSelector(getUserRoomsWithNewMessages);
  // Determines if the app should navigate directly to the chat screen
  const shouldNavigateToChat = useSelector(getShouldNavigateToChat);

  /**
   * Since there's a change in the room, an attempt is made to remove the room's
   * ID from the list of rooms with new messages. Also, all notifications in the
   * notification's tray associated with the room are removed.
   */
  useEffect(() => {
    // A check is made to see if the room's ID is in the list of rooms with new messages
    if (roomsWithNewMessages.includes(roomID)) {
      // Gets the notifications in the notification tray
      const getNotificationsTray = async () =>
        await Notifications.getPresentedNotificationsAsync();

      getNotificationsTray().then((notificationTray) => {
        dispatch(handleRoomEnteredOrChanged(roomID, notificationTray));
      });
    }
  }, [roomID, userMessages]);

  // If the user's messages and the current selected room are available
  if (userMessages && currentRoom)
    return (
      <ChatUI
        messages={userMessages}
        selectedRoom={currentRoom}
        headerHeight={appbarHeight}
      />
    );
  /**
   * If the chat's data isn't available and if the chat
   * was opened by a notification, a loader will display
   */ else if (shouldNavigateToChat) {
    return <LoadingScreen loadingText="Loading Chat Data" />;
  } else {
    // Returns an empty component
    return <></>;
  }
};
