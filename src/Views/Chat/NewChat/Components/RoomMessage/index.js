import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import {
  setCreateRoomLoading,
  resetCreateRoomLoading,
  getCreateRoomLoading,
  setRoomID,
} from "../../../../../store/ui/chat";
import { resetSearchList } from "../../../../../store/ui/peopleSearch";
import { createNewRoom } from "../../../../../store/entities/chat";
import { Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { GiftedChat } from "react-native-gifted-chat";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { renderActions } from "../../../ChatView/Components/InputToolbar/Components/Actions";
import { renderAvatar } from "../../../ChatView/Components/MessageContainer/Avatar";
import { renderBubble } from "../../../ChatView/Components/MessageContainer/Bubble";
import { renderComposer } from "../../../ChatView/Components/InputToolbar/Components/Composer";
import { renderInputToolbar } from "../../../ChatView/Components/InputToolbar";
import { renderMessage } from "../../../ChatView/Components/MessageContainer/Message";
import { renderMessageImage } from "../../../ChatView/Components/MessageContainer/MessageImage";
import { renderMessageText } from "../../../ChatView/Components/MessageContainer/MessageText";
import { renderSend } from "../../../ChatView/Components/InputToolbar/Components/Send";
import { renderSystemMessage } from "../../../ChatView/Components/MessageContainer/SystemMessage";
import {
  getUserInfo,
  getUserImage,
} from "../../../../../store/entities/profile";
import { useNavigation } from "@react-navigation/native";

export const RoomMessage = (props) => {
  // Redux Dispatch
  const dispatch = useDispatch();

  // React Native Navigation
  const navigation = useNavigation();

  // The current text inside the input toolbar
  const [messageText, setMessageText] = useState("");

  // The group name if the selected user's are greater than 1
  const [groupName, setGroupName] = useState("");

  // The list of images the user has selected
  const [selectedImages, setSelectedImages] = useState(JSON.stringify([]));

  // Determines if the actions buttons of the input toolbar should display
  const [showActions, setShowActions] = useState(false);

  // Configuration for setting the custom modal
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    content: <></>,
    height: 0,
    contain: null,
    cover: null,
    styles: {},
  });

  // The loading status of creating a room
  const createRoomLoading = useSelector(getCreateRoomLoading);

  // The user's profile
  const userProfile = useSelector(getUserInfo);

  // The user's image
  const userImage = useSelector(getUserImage);

  // GiftedChat's user format
  const user = {
    _id: userProfile.ID,
    avatar: userImage,
    name: `${userProfile.FirstName} ${userProfile.LastName}`,
  };

  // If there are no selected users, the modal is exited
  useEffect(() => {
    if (props.selectedUsersList.length === 0) props.setVisible(false);
  }, [props.selectedUsersList]);

  // Creates the new room
  const onSend = async (messageObj) => {
    // Gets the message object
    const message = messageObj[0];

    const selectedUsers = props.selectedUsersList.map((user) => {
      return {
        user_id: user.AD_Username,
        user_name: user.AD_Username,
        user_avatar: null,
      };
    });

    // TEMPORARY ROOM OBJECT
    const room = {
      roomImage: null,
      room_id: `TEMP-ROOM-${Math.random() * (1000000 - 0) + 0}`,
      name: groupName,
      group: props.selectedUsersList.length > 1 ? true : false,
      createdAt: message.createdAt,
      lastUpdated: message.createdAt,
      // Users are a combination of selected users and the main user
      users: [
        ...selectedUsers,
        {
          user_id: message.user._id,
          user_name: message.user.image,
          user_avatar: null,
        },
      ],
      lastMessage: message.text,
    };

    // Sets the creation of the room as loading
    dispatch(setCreateRoomLoading);

    // Saves the new room and message to state
    dispatch(createNewRoom(room, message));

    // Sets the selected room to the new room
    dispatch(setRoomID(room.room_id));

    // Creates a new room and navigates to it after 3 seconds
    setTimeout(() => {
      // Exists out the new chat modal
      props.setNewChatModalVisible(false);
      // Sets the loading status of creating a room to false
      dispatch(resetCreateRoomLoading);
      // Deletes the search list results
      dispatch(resetSearchList);
      // Deletes the last searched text
      props.setLastSearchedText(null);
      // Deletes selected users
      props.setSelectedUsers({});
      // Closes the modal to display the chat of the new room
      props.setVisible(false);
      // Navigates to the chat screen
      navigation.navigate("Chat");
    }, 3000);
  };

  /**
   * Configures the minimum height of the input toolbar.
   * Do not delete or change the values below unless you change its
   * corresponding values in its respective components.
   * See documentation for bug "Text_Input"
   */
  const minInputToolbarHeight = () => {
    /**
     * Minimum height is 66. This height is required for the input toolbar to display
     * correctly without a spacing bug between the input toolbar and keyboard
     */
    let minHeight = 66;

    /**
     * If there are selected images, an added spacing of 161 is required to
     * display the images without a spacing bug between the input toolbar and keyboard.
     * The spacing required is 161 because each image has a height of 150 including
     * 11 for spacing.
     */
    if (JSON.parse(selectedImages).length > 0) minHeight += 161;

    /**
     * If the action buttons will be displayed, an added spacing of 45 is required to
     * display the buttons without a spacing bug between the input toolbar and keyboard.
     * The spacing required is 45 because each button has a height of 40 including 5
     * for spacing
     */
    if (showActions) minHeight += 45;

    return minHeight;
  };

  return (
    <Modal
      visible={props.visible}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={() => props.setVisible(false)}
      onDismiss={() => props.setVisible(false)}
    >
      {!createRoomLoading ? (
        <SafeAreaView style={{ flex: 1 }}>
          <LinearGradient
            // Background Linear Gradient
            colors={["#014983", "#015483"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <View
              style={{
                alignSelf: "center",
                width: "90%",
                paddingVertical: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => props.setVisible(false)}
                style={{
                  alignSelf: "flex-start",
                  paddingRight: 5,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Icon
                    name={"chevron-left"}
                    type="font-awesome-5"
                    color="white"
                    size={22}
                    containerStyle={{
                      padding: 5,
                      marginRight: 5,
                    }}
                  />
                  <Text style={styles.titleText}>People Search</Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          {props.selectedUsersList.length > 1 && (
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: "5%",
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  marginRight: 10,
                  fontWeight: "bold",
                  color: "#014983",
                }}
              >
                Group Name:
              </Text>
              <TextInput
                placeholder="Type a name..."
                placeholderTextColor="#2f3d49"
                value={groupName}
                selectTextOnFocus={true}
                returnKeyType="done"
                onChangeText={(name) => setGroupName(name)}
                style={{
                  borderColor: "#014983",
                  borderRadius: 4,
                  borderWidth: 2,
                  flex: 1,
                  fontSize: 18,
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                }}
              />
            </View>
          )}
          {props.selectedUsers}
          <GiftedChat
            alignTop
            alwaysShowSend
            bottomOffset={getBottomSpace()}
            isCustomViewBottom
            messages={[]}
            messagesContainerStyle={styles.messagesContainer}
            minInputToolbarHeight={minInputToolbarHeight()}
            onInputTextChanged={setMessageText}
            onSend={onSend}
            parsePatterns={(linkStyle) => [
              {
                pattern: /#(\w+)/,
                style: linkStyle,
              },
            ]}
            renderActions={(props) => {
              const ImageHandler = { selectedImages, setSelectedImages };
              const ModalHandler = { modalConfig, setModalConfig };
              return renderActions(props, ImageHandler, ModalHandler);
            }}
            renderAvatar={renderAvatar}
            renderBubble={renderBubble}
            renderComposer={renderComposer}
            /**
             * Uncomment if you'd like to add a custom view to each message.
             * This view appears after a message's text and before the message's
             * status information (aka date, sent, delivered, etc.)
             */
            // renderCustomView={renderCustomView}
            renderInputToolbar={(props) => {
              const ImageHandler = { selectedImages, setSelectedImages };
              const ModalHandler = { modalConfig, setModalConfig };
              const ActionHandler = { showActions, setShowActions };
              return renderInputToolbar(
                props,
                ImageHandler,
                ModalHandler,
                ActionHandler
              );
            }}
            renderMessage={renderMessage}
            renderMessageImage={(props) => {
              const ModalHandler = { modalConfig, setModalConfig };
              return renderMessageImage(props, ModalHandler);
            }}
            renderMessageText={renderMessageText}
            renderSend={renderSend}
            renderSystemMessage={renderSystemMessage}
            scrollToBottom
            // showUserAvatar
            text={messageText}
            user={user}
          />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("./Images/mascot.png")}
              style={styles.loadingImage}
            />
            <Text style={styles.loadingText}>Creating Room...</Text>
          </View>
        </SafeAreaView>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  titleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  gradient: { backgroundColor: "blue" },
  messagesContainer: {
    backgroundColor: "white",
  },
  loadingImage: {
    resizeMode: "contain",
    width: "50%",
    height: "50%",
  },
  loadingText: {
    color: "#014983",
    marginTop: "10%",
    fontSize: Dimensions.get("window").width * 0.1,
  },
});
