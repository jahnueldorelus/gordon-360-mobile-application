import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { TouchableOpacity } from "react-native";
import {
  getMainUser,
  getMessages,
  getImages,
} from "../../../Services/Messages";
import { Icon, Avatar, Image } from "react-native-elements";

export const ChatInfo = (props) => {
  // const [messages, setMessages] = useState(null);
  const [users, setUsers] = useState([]);
  const [messagesWithImages, setMessagesWithImages] = useState([]);
  const [mainUser, setMainUser] = useState([null]);
  const [room, setRoom] = useState(null);
  const [minImageWidthAndHeight, setMinImageWidthAndHeight] = useState(200);
  const [viewWidth, setViewWidth] = useState();
  const [showImageViewer, setShowImageViewer] = useState(false);

  /**
   * Sets the main user's data, the room's messages, the room itself,
   * and a list of all the images in the room
   */
  useEffect(() => {
    setUserData();
    setRoom(props.route.params.roomProp);
    getImagesData();
  }, []);

  /**
   * Gets the list of users apart from the main user
   */
  async function setUserData() {
    await getMainUser().then((currentUser) => {
      // Gets the main user
      setMainUser(currentUser);
      // Gets the list of users excluding the main user
      setUsers(
        props.route.params.roomProp.users.filter((user) => {
          return user._id !== currentUser._id;
        })
      );
    });
  }

  /**
   * Gets the images of the room for the chat details
   */
  async function getImagesData() {
    let images = await getImages(props.route.params.roomProp._id);
    // Checks to make sure that the images variable is an array before
    // attempting to map
    if (Array.isArray(images)) {
      setMessagesWithImages(
        images.map((message) => {
          return { url: message.image };
        })
      );
    }
  }

  /**
   * DO NOT REMOVE TOUCHABLE FEEDBACK. ALSO, DON'T USE THE COMPONENT BUTTON
   * IN THIS MODAL. USE TOUCHABLEOPACITY INSTEAD. THIS FIXES A BUG WITHIN REACT NATIVE.
   * SEE DOCUMENTATION FOR BUG "Modal_Closing_State_Unchanged"
   */
  if (users && mainUser && room && messagesWithImages) {
    return (
      <Modal
        visible={props.visible}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => props.setVisible(false)}
        onDismiss={() => props.setVisible(false)}
      >
        <TouchableWithoutFeedback
          onPressOut={(e) => {
            if (e.nativeEvent.locationY < 0) {
              props.setVisible(false);
            }
          }}
          style={styles.touchableWithout}
        >
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.touchableWithout}>
              <View style={styles.title}>
                <Text style={styles.titleText}>Chat Details</Text>
                <TouchableOpacity
                  title="Close Modal"
                  onPress={() => props.setVisible(false)}
                >
                  <Icon
                    name="close"
                    type="material"
                    color="#002F64"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginHorizontal: 30,
                  marginTop: 10,
                  marginBottom: 30,
                }}
              >
                <Text
                  style={{
                    color: "#3C6AA8",
                    fontSize: 20,
                    fontWeight: "600",
                    marginBottom: 10,
                  }}
                >
                  Users
                </Text>
                {users.map((user, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#3C6AA8",
                        paddingHorizontal: 20,
                        borderRadius: 10,
                        paddingVertical: 5,
                        borderWidth: 1,
                        marginTop: index === 0 ? 0 : 10,
                      }}
                    >
                      <Avatar
                        rounded
                        source={{
                          uri: user.avatar,
                        }}
                      />
                      <Text
                        style={{
                          marginLeft: 20,
                          fontSize: 18,
                          fontWeight: "500",
                          color: "white",
                        }}
                      >
                        {user.name}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View
                style={{
                  marginHorizontal: 30,
                  marginTop: 10,
                  marginBottom: 30,
                }}
              >
                <Text
                  style={{
                    color: "#3C6AA8",
                    fontSize: 20,
                    fontWeight: "600",
                  }}
                >
                  Images
                </Text>
                <View
                  onLayout={(e) => {
                    setViewWidth(e.nativeEvent.layout.width / 2 - 10);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    // backgroundColor: "#3C6AA8",
                    borderRadius: 10,
                    paddingVertical: 5,
                    // borderWidth: 1,
                    marginTop: 10,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {messagesWithImages.map((message, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => setShowImageViewer(true)}
                        key={index}
                      >
                        <Image
                          source={{ uri: message.url }}
                          style={{
                            width: viewWidth
                              ? Math.min(viewWidth, minImageWidthAndHeight)
                              : minImageWidthAndHeight,
                            height: viewWidth
                              ? Math.min(viewWidth, minImageWidthAndHeight)
                              : minImageWidthAndHeight,
                            margin: 5,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#3C6AA8",
                          }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            {/* <ImageViewer imageUrls={messagesWithImages} /> */}
          </ScrollView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  } else return <></>;
};

const styles = StyleSheet.create({
  touchableWithout: { flex: 1 },
  title: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    width: "80%",
    marginVertical: 20,
  },
  titleText: {
    color: "#002F64",
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 5,
  },
});
