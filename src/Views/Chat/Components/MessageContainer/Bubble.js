import React from "react";
import { View, Text } from "react-native";
import { Bubble } from "react-native-gifted-chat";

/**
 * Renders the text message Bubble in the MessageContainer
 * @param {JSON} props Props passed from parent
 */
export const renderBubble = (props) => {
  // Gets the previous and current message from props
  let { previousMessage, currentMessage } = props;

  return (
    <View>
      {nameAtTopOfGroupedUserTexts(previousMessage, currentMessage, props.user)}
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
    </View>
  );
};

/**
 * Creates the name of the user in a group of texts.
 * If a user texts multiple consecutive texts, their username will
 * appear at the top of their first text. This checks to see if the
 * current text message is the user's first in a group of texts. If so,
 * their name will appear above the current text message. If not, no name will appear. If the
 * current text message belongs to the main user (the person receiving the texts), then their
 * name will not appear
 *
 * @param {Object} previousMessage The previous text message
 * @param {Object} currentMessage The current text message. This is the main message that will
 *                                be shown. The othermessages are used for comparison
 * @param {Object} mainUser The main user (The person who's receiving the text messages)
 */
function nameAtTopOfGroupedUserTexts(
  previousMessage,
  currentMessage,
  mainUser
) {
  // Style of the user's name
  let textStyle = { color: "#014983", paddingLeft: 5, paddingBottom: 5 };

  // Checks to see if currentMessage is defined and not empty
  if (currentMessage && currentMessage.user && currentMessage.user.name) {
    // Checks to make sure that the current message doesn't belong to the main user
    if (currentMessage.user._id !== mainUser._id) {
      // Checks to see if previousMessage is defined and not empty
      if (
        previousMessage &&
        previousMessage.user &&
        previousMessage.user.name
      ) {
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
          previousMessage.user._id !== currentMessage.user._id ||
          !(
            prevDate.getFullYear() === currentDate.getFullYear() &&
            prevDate.getMonth() === currentDate.getMonth() &&
            prevDate.getDate() === currentDate.getDate()
          )
        ) {
          return <Text style={textStyle}>{currentMessage.user.name}</Text>;
        }
      }
      // If the previousMessage is a system message, then the user of the currentMessage is shown
      else if (previousMessage && previousMessage.system) {
        return <Text style={textStyle}>{currentMessage.user.name}</Text>;
      }
    }
  }
  // Nothing is returned if any nothing is returned from above
  return <></>;
}
