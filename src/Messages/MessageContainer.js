/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { View, Text } from "react-native";
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
} from "react-native-gifted-chat";
import messages from "./messages";

export const renderAvatar = (props) => (
  <Avatar
    {...props}
    // containerStyle={{ left: { borderWidth: 3, borderColor: "red" }, right: {} }}
    // imageStyle={{ left: { borderWidth: 2, borderColor: "#014983" }, right: {} }}
  />
);

export const renderBubble = (props) => {
  /****** Just Seeing what's passed into props */
  let { previousMessage, currentMessage, nextMessage } = props;
  // if (
  //   Object.keys(nextMessage).length === 0 &&
  //   previousMessage.user.name === currentMessage.user.name
  // )
  // console.log("\n\n", previousMessage, currentMessage, nextMessage, "\n\n");
  /****** Just Seeing what's passed into props */

  return (
    <View>
      {nameAtTopOfGroupedUserTexts(previousMessage, currentMessage)}
      <Bubble
        {...props}
        // renderTime={() => <Text>Time</Text>}
        // renderTicks={() => <Text>Ticks</Text>}
        containerStyle={{
          left: {},
          right: { borderColor: "white", borderWidth: 4 },
        }}
        // wrapperStyle={{
        //   left: { borderColor: "#31342B", borderWidth: 2 },
        //   right: {},
        // }}
        // bottomContainerStyle={{
        //   left: { borderColor: "black", borderWidth: 4 },
        //   right: {},
        // }}
        // tickStyle={{}}
        // usernameStyle={{ color: "black", fontWeight: "100" }}
        // containerToNextStyle={{
        //   left: { borderColor: "#31342B", borderWidth: 4 },
        //   right: {},
        // }}
        // containerToPreviousStyle={{
        //   left: { borderColor: "mediumorchid", borderWidth: 4 },
        //   right: {},
        // }}
      />
      {/* {nameAtBottomOfGroupedUserTexts(
        previousMessage,
        currentMessage,
        nextMessage
      )} */}
    </View>
  );
};

export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: "#313428" }}
    wrapperStyle={{ borderWidth: 10, borderColor: "#313428" }}
    textStyle={{ color: "white", fontWeight: "900" }}
  />
);

export const renderMessage = (props) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: "white" },
      right: { backgroundColor: "white" },
    }}
  />
);

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    containerStyle={{
      left: { backgroundColor: "#31342B" },
      right: { backgroundColor: "black" },
    }}
    textStyle={{
      left: { color: "white" },
      right: { color: "white" },
    }}
    linkStyle={{
      left: { color: "#31342B" },
      right: { color: "gray" },
    }}
    customTextStyle={{ fontSize: 24, lineHeight: 16 }}
  />
);

export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 20, alignItems: "center" }}>
    <Text>{user.name}</Text>
  </View>
);

/**
 * Creates the name of the user in a group of texts.
 * If a user texts multiple consecutive texts, their username will
 * appear at the bottom of their last text. This checks to see if the
 * current text message is the user's last in a group of texts. If so,
 * their name will appear below the current text message. If not, no name will appear
 * @param {Object} previousMessage The previous text message
 * @param {Object} currentMessage The current text message. This is the main message that will
 *                                be shown. The othermessages are used for comparison
 * @param {Object} nextMessage The next text message
 */
function nameAtBottomOfGroupedUserTexts(
  previousMessage,
  currentMessage,
  nextMessage
) {
  // Checks to see if previousMessage is defined and not empty
  if (previousMessage && previousMessage.user && previousMessage.user.name) {
    // Checks to see if currentMessage is defined and not empty
    if (currentMessage && currentMessage.user && currentMessage.user.name) {
      // Checks to see if the previous and current message are from the same user
      if (previousMessage.user.name === currentMessage.user.name) {
        // Checks to see if nextMessage is defined and not empty
        if (nextMessage && nextMessage.user && nextMessage.user.name) {
          // Gets the date of the current and next message
          let currentDate = new Date(currentMessage.createdAt);
          let nextDate = new Date(nextMessage.createdAt);
          /**
           * Checks to see if the current message and the next message are two different
           * users. Also checks to see if the date of the next message is not the same as the current.
           * If true for any, then the current message is the last message of the user and the
           * user's name is shown
           */
          if (
            nextMessage.user.name !== currentMessage.user.name ||
            !(
              currentDate.getFullYear() === nextDate.getFullYear() &&
              currentDate.getMonth() === nextDate.getMonth() &&
              currentDate.getDate() === nextDate.getDate()
            )
          ) {
            return <Text>{currentMessage.user.name}</Text>;
          }
        }
        // Returns the user's name since there's no nextMessage. Therefore,
        // currentMessage is the last text of the user.
        else if (Object.keys(nextMessage).length === 0) {
          return <Text>{currentMessage.user.name}</Text>;
        }
      }
    }
  }
  // Nothing is returned if any nothing is returned from above
  return <></>;
}

/**
 * Creates the name of the user in a group of texts.
 * If a user texts multiple consecutive texts, their username will
 * appear at the top of their first text. This checks to see if the
 * current text message is the user's first in a group of texts. If so,
 * their name will appear above the current text message. If not, no name will appear
 * @param {Object} previousMessage The previous text message
 * @param {Object} currentMessage The current text message. This is the main message that will
 *                                be shown. The othermessages are used for comparison
 */
function nameAtTopOfGroupedUserTexts(previousMessage, currentMessage) {
  let textStyle = { padding: 1, color: "#014983" };
  // Checks to see if previousMessage is defined and not empty
  if (currentMessage && currentMessage.user && currentMessage.user.name) {
    if (previousMessage && previousMessage.user && previousMessage.user.name) {
      // Gets the date of the current and next message
      let prevDate = new Date(previousMessage.createdAt);
      let currentDate = new Date(currentMessage.createdAt);
      /**
       * Checks to see if currentMessage is defined and not empty. If there's no previous
       * messages, the user's name is shown. If there's a previous message and the user of the
       * previous message is not the same with the current, the user's name is shown. If the user
       * is the same, then their name will be shown only if the previous message has a different date
       * than the current
       */
      if (
        Object.keys(previousMessage).length === 0 ||
        previousMessage.user.name !== currentMessage.user.name ||
        !(
          prevDate.getFullYear() === currentDate.getFullYear() &&
          prevDate.getMonth() === currentDate.getMonth() &&
          prevDate.getDate() === currentDate.getDate()
        )
      ) {
        return <Text style={textStyle}>{currentMessage.user.name}</Text>;
      }
    }
  }
  // Nothing is returned if any nothing is returned from above
  return <></>;
}
