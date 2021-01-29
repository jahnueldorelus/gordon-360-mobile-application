import signalr from "react-native-signalr";

export function startWebConnection() {
  // Creates the url connecton to the server
  const connection = signalr.hubConnection("https://360apitrain.gordon.edu");

  // Allows for console logging of SignalR background processes
  connection.logging = true;

  // Connects to the chat hub on the server
  const proxy = connection.createHubProxy("chatHub");

  /**
   * Handles the request from the server on the hub "chatHub"
   * with message type of "broadcastMessage"
   */
  // proxy.on("broadcastMessage", (name, message) => {
  //   console.log(`Message from ${name}: ${message}`);
  // });
  proxy.on("test", (message) => {
    console.log(`Message from server: ${message}`);
  });

  // Starts the connection with the server
  connection
    .start()

    // After the connection to the server is successful
    .done(() => {
      console.log("Now connected, connection ID=" + connection.id);

      // // Sends a message to the "chathub" hub
      // proxy
      //   .invoke("send", "Server", "Hey Server! How's it going?")
      //   // If the messge send to the "chathub" hub fails
      //   .fail(() => {
      //     console.warn(
      //       "Something went wrong when sending a message to the server. Are you connected to it? If so, are you parameters in a correct format?"
      //     );
      //   });
      // proxy.invoke("test");
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
