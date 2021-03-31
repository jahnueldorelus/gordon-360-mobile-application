import signalr from "react-native-signalr";
import { getUserInfo } from "../../store/entities/profile";
import { getSelectedRoomID } from "../../store/ui/chat";
import { getUserRoomByID } from "../../store/entities/chat";
import { apiRequested } from "../../store/middleware/api";
import { liveMessageUpdate } from "../../store/entities/chat";

// Creates the url connecton to the server
const connection = signalr.hubConnection("https://360apitrain.gordon.edu");
// const connection = signalr.hubConnection("http://172.27.40.154:45455");

let hasSavedID = false;

// Allows for console logging of SignalR background processes
connection.logging = true;

// Connects to the chat hub on the server
const proxy = connection.createHubProxy("chatHub");

/**
 * Starts the web socket connection with the server
 * @param {Object} store The redux store
 * @param {Object} navigation The application's navigation
 * @param {Object} route The application's navigation route
 */
export function startWebConnection(store, navigation, route) {
  // The main user
  const mainUser = getUserInfo(store.getState());

  /**
   * Handles the request from the server on the hub "chatHub"
   * with message type of "broadcastMessage"
   */
  proxy.on("broadcastMessage", (message) => {
    // If connected to server and the connection ID hasn't been saved
    if (message === "connectedToServer" && !hasSavedID) {
      proxy.invoke("saveConnection", mainUser.ID);
      hasSavedID = true;
    }
  });

  proxy.on("sendAsync", (message, userID) => {
    // If a message was returned
    if (message && userID) {
      // Updates the user's messages
      store.dispatch(liveMessageUpdate(message, userID));
    }

    console.log(navigation, route);
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
 * @param {*} dispatch The redux store dispatch action
 * @param {Object} state The redux store state
 */
export function invokeNewMessage(message, dispatch, state) {
  if (connection.id) {
    // The main user
    const mainUser = getUserInfo(state);

    // The selected room ID
    let roomID = getSelectedRoomID(state);
    // The selected room Object
    let roomObject = getUserRoomByID(roomID)(state);
    // List of user IDs in the room (apart from the main user)
    let userIDs = [mainUser.ID];

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
