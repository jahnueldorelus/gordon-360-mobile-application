import { Alchemy } from "./AlchemyClient/alchemy-client";

export function startWebConnection() {
  let AlchemyChatServer = new Alchemy({
    Server: "360train.edu",
    Port: "81",
    SocketType: "",
    Action: "api",
    DebugMode: true,
  });

  AlchemyChatServer.Connected = function () {
    console.log("Connected to Server!");
  };

  AlchemyChatServer.Disconnected = function () {
    console.log("Disconnected from Server!");
  };

  AlchemyChatServer.MessageReceived = function (event) {
    console.log("Message: ", event.data);
  };

  AlchemyChatServer.Start();
}
