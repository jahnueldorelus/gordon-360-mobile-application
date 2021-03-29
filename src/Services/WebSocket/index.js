import signalr from "react-native-signalr";
import { getUserInfo } from "../../store/entities/profile";
import { getSelectedRoomID } from "../../store/ui/chat";
import { getUserRoomByID } from "../../store/entities/chat";
import { apiRequested } from "../../store/middleware/api";
import { liveMessageUpdate } from "../../store/entities/chat";

// Creates the url connecton to the server
const connection = signalr.hubConnection("https://360apitrain.gordon.edu");
// const connection = signalr.hubConnection("http://172.27.40.154:45455");

// Allows for console logging of SignalR background processes
connection.logging = true;

// Connects to the chat hub on the server
const proxy = connection.createHubProxy("chatHub");

/**
 * Starts the web socket connection with the server
 * @param {Object} store The redux store
 */
export function startWebConnection(store) {
  // The main user
  const mainUser = getUserInfo(store.getState());

  /**
   * Handles the request from the server on the hub "chatHub"
   * with message type of "broadcastMessage"
   */
  proxy.on("broadcastMessage", (message) => {
    // If connected to server
    if (message == "connectedToServer") {
      proxy.invoke("saveConnection", mainUser.ID);
    }
    // else if (message == "connectedToServer") {
    //   // proxy.invoke("saveConnection", mainUser.ID);
    // }
    else console.log(`Message:  ${message}`);
  });

  proxy.on("sendAsync", (message, userID) => {
    // If a message was returned
    if (message && userID) {
      // Updates the user's messages
      store.dispatch(liveMessageUpdate(message, userID));
    }
  });

  // Starts the connection with the server
  connection
    .start()

    // After the connection to the server is successful
    .done(() => {
      console.log("Now connected, connection ID=" + connection.id);
    })

    // If connecting to the server fails
    .fail(() => {
      console.log("Connection to server failed");
    });

  // If the network connection is slow
  connection.connectionSlow(() => {
    console.log(
      "We are currently experiencing difficulties with the connection."
    );
  });

  // Displays a user-friendly message for a SignalR HTTPS error
  connection.error((error) => {
    const errorMessage = error.message;
    let detailedError = "";
    if (error.source && error.source._response) {
      detailedError = error.source._response;
    }
    if (
      detailedError ===
      "An SSL error has occurred and a secure connection to the server cannot be made."
    ) {
      console.log(
        "When using react-native-signalr on ios with http remember to enable http in App Transport Security https://github.com/olofd/react-native-signalr/issues/14"
      );
    }
    console.debug("SignalR error: " + errorMessage, detailedError);
  });
}

/**
 *
 * @param {Object} message The message object to send to the server
 * @param {Array} usersList The list of user IDs in the room
 * @param {Object} state The redux store state
 */
export function invokeNewMessage(message, dispatch, getState) {
  if (connection.id) {
    // The main user
    const mainUser = getUserInfo(getState());

    // The selected room ID
    let roomID = getSelectedRoomID(getState());
    // The selected room Object
    let roomObject = getUserRoomByID(roomID)(getState());
    // List of user IDs in the room (apart from the main user)
    let userIDs = [];

    // Parses through the list of users to retrieve all users
    // except for the main user who sent the message
    roomObject.users.forEach((user) => {
      if (user.id !== mainUser.ID) {
        userIDs.push(user.id);
      }
    });

    proxy.invoke("refreshMessages", userIDs, message, mainUser.ID);
  }
}
